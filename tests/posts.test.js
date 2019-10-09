const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const User = require('../src/models/User')
const Post = require('../src/models/Post')
const {
  syncDatabase,
  populateTables,
  sampleUsers,
  tokens
} = require('./fixtures/db')

beforeAll(syncDatabase)
beforeEach(populateTables)

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
