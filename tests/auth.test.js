const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const { syncDatabase, populateTables, sampleUsers } = require('./fixtures/db')

beforeAll(syncDatabase)
beforeEach(populateTables)

/**
 * Tests for auth middleware
 */

test('Should get all users when auth is valid (user is logged in)', async () => {
  // login a sample user to get an auth token
  const loginResponse = await request(app)
    .post('/users/login')
    .send({
      email: sampleUsers[0].email,
      password: sampleUsers[0].password
    })

  // send req to auth protected endpoint
  const response = await request(app)
    .get('/users')
    .set('x-auth-token', loginResponse.body.token) // set token header
    .expect(200) // assert http res code

  // assert res has array with the 3 sample users
  expect(response.body.length).toBe(3)
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