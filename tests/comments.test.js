const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const Comment = require('../src/models/Comment')
const {
  syncDatabase,
  dbPosts,
  tokens
} = require('./fixtures/db')

beforeEach(syncDatabase)

/**
 * Create new comment endpoint tests
 */

test('Should create a new comment when content is provided and post id is valid', async () => {
  const response = await request(app)
    .post(`/comments/new/${dbPosts[0].id}`)
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
  expect(comment.post_id).toEqual(dbPosts[0].id)

  // assert response body content to match the post content
  expect(response.body.content).toEqual('Wow good job!')
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