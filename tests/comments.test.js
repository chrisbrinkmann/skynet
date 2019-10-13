const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const Comment = require('../src/models/Comment')
const Post = require('../src/models/Post')
const { areFriends } = require('../src/utils/utils')
const { syncDatabase, dbPosts, dbComments, tokens } = require('./fixtures/db')

beforeEach(syncDatabase)

/**
 * Create new comment endpoint tests
 */

test('Should create a new comment when content is provided, post id is valid, and the two users are friends', async () => {
  const response = await request(app)
    .post(`/comments/new/${dbPosts[3].id}`)
    .set('x-auth-token', tokens[1])
    .send({
      content: 'Wow good job!'
    })
    .expect(201) // assert http res code

  const comment = await Comment.findOne({ where: { content: 'Wow good job!' } })
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // assert comment exists in db with name and id that matches req content and token
  expect(comment.user_id).toEqual(decoded.id)

  // assert comment has post id matching req param
  expect(comment.post_id).toEqual(dbPosts[3].id)

  // assert the commenter and post owner are friends
  expect(await areFriends(decoded.id, dbPosts[3].user_id)).toBeTruthy()

  // assert response body content to match the post content
  expect(response.body.content).toEqual('Wow good job!')
})

test('Should not create a new comment the two users are not friends', async () => {
  const response = await request(app)
    .post(`/comments/new/${dbPosts[0].id}`)
    .set('x-auth-token', tokens[1])
    .send({
      content: 'Wow good job!'
    })
    .expect(401) // assert http res code

  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  const comment = await Comment.findOne({ where: { content: 'Wow good job!' } })

  // assert no comment with req body content was added to the db
  expect(comment).toBeNull()

  // assert the commenter and post owner are not friends
  expect(await areFriends(decoded.id, dbPosts[0].user_id)).toBeFalsy()

  // assert response body content to match the post content
  expect(response.body.msg).toEqual('Must be friends to comment on post')
})

test('Should not create a new comment when content is empty', async () => {
  const response = await request(app)
    .post(`/comments/new/${dbPosts[0].id}`)
    .set('x-auth-token', tokens[2])
    .send({ content: '' })
    .expect(400) // assert http res code

  const comment = await Comment.findOne({ where: { content: '' } })
  expect(comment).toBeNull() // assert no empty comment was added to db

  // assert response body content to match the post content
  expect(response.body.hasOwnProperty('errors')).toBeTruthy()
})

test('Should not create a new comment for non existant post id', async () => {
  const response = await request(app)
    .post(`/comments/new/99`)
    .set('x-auth-token', tokens[2])
    .send({ content: 'This is a comment.' })
    .expect(404) // assert http res code

  const comment = await Comment.findOne({
    where: { content: 'This is a comment.' }
  })
  expect(comment).toBeNull() // assert comment was nat added to the db

  // assert response body content to match the post content
  expect(response.body.msg).toEqual('Post not found')
})

/**
 * Delete comment tests
 */

test('Should delete a comment when id is valid and deleter owns the comment', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[3], process.env.JWT_SECRET)
  
  // assert req user created the comment to delete
  expect(decoded.id === dbComments[4].user_id)

  // dbUsers[3] deletes dbComments[4]
  const response = await request(app)
    .delete(`/comments/${dbComments[4].id}`)
    .set('x-auth-token', tokens[3])
    .expect(200) // assert http res code

  // query db for deleted comment
  const comment = await Comment.findOne({
    where: { id: dbComments[4].id }
  })

  // assert comment is no longer in db
  expect(comment).toBeNull()

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('Comment deleted')
})

test('Should delete a comment when id is valid and deleter owns the parent post, but does not own the comment', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)
  
  // query db for parent post of comment
  const post = await Post.findOne({
    where: { id: dbComments[0].post_id }
  })

  // assert req user owns parent post of the comment to delete
  expect(decoded.id === post.user_id)

  // assert req user does not own the comment to delete
  expect(decoded.id !== dbComments[0].user_id)

  // dbUsers[0] deletes dbComments[0]
  const response = await request(app)
    .delete(`/comments/${dbComments[0].id}`)
    .set('x-auth-token', tokens[0])
    .expect(200) // assert http res code

  // query db for deleted comment
  const comment = await Comment.findOne({
    where: { id: dbComments[0].id }
  })

  // assert comment is no longer in db
  expect(comment).toBeNull()

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('Comment deleted')
})

test('Should not delete a comment when id is valid, but the deleter does not own the comment or parent post', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)
  
  // assert req user did not create the comment to delete
  expect(decoded.id !== dbComments[4].user_id)

  // query db for parent post of comment
  const post = await Post.findOne({
    where: { id: dbComments[4].post_id }
  })

  // assert req user did not create the parent post of the comment to delete
  expect(decoded.id !== post.user_id)

  // dbUsers[1] deletes dbComments[4]
  const response = await request(app)
    .delete(`/comments/${dbComments[4].id}`)
    .set('x-auth-token', tokens[1])
    .expect(401) // assert http res code

  // query db for attempted deleted comment
  const comment = await Comment.findOne({
    where: { id: dbComments[4].id }
  })

  // assert comment is still in db
  expect(comment).not.toBeNull()

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('Only post or comment owner can delete comments')
})

test('Should send applicable http response when deleting non existant comment', async () => {
  // query db for attempted deleted comment
  const comment = await Comment.findOne({
    where: { id: 99 }
  })

  // assert no comment with id: 99 exists in db
  expect(comment).toBeNull()

  // dbUsers[2] deletes comment with id: 99
  const response = await request(app)
    .delete(`/comments/99`)
    .set('x-auth-token', tokens[2])
    .expect(404) // assert http res code

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('Comment not found')
})

test('Should send applicable http response when delete comment id syntax is invalid (non integer)', async () => {
  // dbUsers[2] deletes comment with id: asdf
  const response = await request(app)
    .delete(`/comments/asdf`)
    .set('x-auth-token', tokens[2])
    .expect(400) // assert http res code

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('Comment not found')
})
