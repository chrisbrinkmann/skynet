const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const {
  syncDatabase,
  populateTables,
  sampleUsers,
  tokens
} = require('./fixtures/db')

beforeAll(syncDatabase)
beforeEach(populateTables)

/**
 * Tests for auth middleware
 */

test('Should get all users when auth is valid (user is logged in)', async () => {
  // send reqs to auth protected endpoints
  const response1 = await request(app)
    .get('/users')
    .set('x-auth-token', tokens[0]) // set sampleUser[0] token header
    .expect(200) // assert http res code

  const response2 = await request(app)
    .get('/users')
    .set('x-auth-token', tokens[1]) // set sampleUser[1] token header
    .expect(200) // assert http res code

  const response3 = await request(app)
    .get('/users')
    .set('x-auth-token', tokens[2]) // set sampleUser[2] token header
    .expect(200) // assert http res code

  // assert res has array with the 3 sample users
  expect(response1.body.length).toBe(3)
  expect(response2.body.length).toBe(3)
  expect(response3.body.length).toBe(3)
})

test('Should not get any users if no auth token is provided', async () => {
  // send req to auth protected endpoint; do not set any token header
  const response = await request(app)
    .get('/users')
    .expect(401) // assert http res code

  // assert response message content
  expect(response.body.msg).toBe('No token; authorization denied')
})

test('Should not get any users if an invalid token is provided', async () => {
  // send req to auth protected endpoint; do not provide any token header
  const response = await request(app)
    .get('/users')
    .set('x-auth-token', 'someInvalidToken') // provide invalid token header
    .expect(401) // assert http res code

  // assert response message content
  expect(response.body.msg).toBe('Invalid token; authorization denied')
})

test('Should not create a new post if no auth token is provided', async () => {
  // send req to auth protected endpoint; do not set any token header
  const response = await request(app)
    .post('/posts/new')
    .expect(401) // assert http res code

  // assert response message content
  expect(response.body.msg).toBe('No token; authorization denied')
})

test('Should not create a new post if an invalid token is provided', async () => {
  // send req to auth protected endpoint; do not provide any token header
  const response = await request(app)
    .post('/posts/new')
    .set('x-auth-token', 'someInvalidToken') // provide invalid token header
    .expect(401) // assert http res code

  // assert response message content
  expect(response.body.msg).toBe('Invalid token; authorization denied')
})
