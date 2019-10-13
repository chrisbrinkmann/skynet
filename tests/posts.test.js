const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const Post = require('../src/models/Post')
const Comment = require('../src/models/Comment')
const { syncDatabase, tokens, dbPosts } = require('./fixtures/db')

beforeEach(syncDatabase)

/**
 * Create new post endpoint tests
 */

test('Should create a new post when content is provided', async () => {
  const response = await request(app)
    .post('/posts/new')
    .set('x-auth-token', tokens[0])
    .send({
      content: 'First post lol'
    })
    .expect(201) // assert http res code

  const post = await Post.findOne({ where: { content: 'First post lol' } })
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // assert post exists in db with name and id that matches req content and token
  expect(post.user_id).toEqual(decoded.id)

  // assert response body content to match the post content
  expect(response.body.content).toEqual('First post lol')
})

test('Should not create a new post when content is empty', async () => {
  const response = await request(app)
    .post('/posts/new')
    .set('x-auth-token', tokens[0])
    .send({ content: '' })
    .expect(400) // assert http res code

  // assert response body content to match the post content
  expect(response.body.hasOwnProperty('errors')).toBeTruthy()
})

/**
 * Delete post endpoint tests
 */

test('Should delete post when post id is valid and deleter owns post', async () => {
  // cache req user object from auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // assert req user owns post to delete
  expect(decoded.id === dbPosts[1].user_id).toBeTruthy()

  // dbUsers[1] deletes dbPosts[1]
  const response = await request(app)
    .delete(`/posts/${dbPosts[1].id}`)
    .set('x-auth-token', tokens[1])
    .expect(200) // assert http res code

  // query db for deleted post
  const post = await Post.findOne({ where: { id: dbPosts[1].id } })

  // assert deleted post is no longer in db
  expect(post).toBeNull()

  // assert http response msg matches expected
  expect(response.body.msg).toEqual('Post deleted')
})

test('Should delete children comments of post when post id is valid and deleter owns post', async () => {
  // cache req user object from auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // assert req user owns post to delete
  expect(decoded.id === dbPosts[1].user_id).toBeTruthy()

  // query db for children comments of post to delete
  let comments = await Comment.findAll({ where: { post_id: dbPosts[1].id } })

  // assert existance of 2 children comments
  expect(comments.length).toBe(2)

  // dbUsers[1] deletes dbPosts[1]
  const response = await request(app)
    .delete(`/posts/${dbPosts[1].id}`)
    .set('x-auth-token', tokens[1])
    .expect(200) // assert http res code

  // query db for children comments of deleted post
  comments = await Comment.findAll({ where: { post_id: dbPosts[1].id } })

  // assert children comments no longer in db
  expect(comments).toEqual([])
})

test('Should not delete a post when the deleter does not own post', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // assert req user does not own the post to delete
  expect(decoded.id !== dbPosts[2].user_id)

  // dbUsers[1] deletes dbPosts[2]
  const response = await request(app)
    .delete(`/posts/${dbPosts[2].id}`)
    .set('x-auth-token', tokens[1])
    .expect(401) // assert http res code

  // query db for attempted deleted post
  const post = await Post.findOne({
    where: { id: dbPosts[2].id }
  })

  // assert post is still in db
  expect(post).not.toBeNull()

  // assert http response msg to match expected
  expect(response.body.msg).toEqual(
    'Cannot delete another users post'
  )
})

test('Should send applicable http response when deleting non existant post', async () => {
  // query db for attempted deleted post
  const post = await Post.findOne({
    where: { id: 99 }
  })

  // assert no post with id: 99 exists in db
  expect(post).toBeNull()

  // dbUsers[2] deletes post with id: 99
  const response = await request(app)
    .delete(`/posts/99`)
    .set('x-auth-token', tokens[2])
    .expect(404) // assert http res code

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('Post not found')
})

test('Should send applicable http response when delete post id syntax is invalid (non integer)', async () => {
  // dbUsers[2] deletes post with id: asdf
  const response = await request(app)
    .delete(`/posts/asdf`)
    .set('x-auth-token', tokens[2])
    .expect(400) // assert http res code

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('Post not found')
})
