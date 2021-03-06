const request = require('supertest')
const app = require('../src/app')
const {
  syncDatabase,
  dbUsers,
  tokens
} = require('./fixtures/db')

beforeEach(syncDatabase)

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

  // assert res has array with the correct amount of users
  expect(response1.body.length).toBe(dbUsers.length)
  expect(response2.body.length).toBe(dbUsers.length)
  expect(response3.body.length).toBe(dbUsers.length)
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

test('Should not create a new comment if no auth token is provided', async () => {
  // send req to auth protected endpoint; do not set any token header
  const response = await request(app)
    .post('/comments/new/1')
    .expect(401) // assert http res code

  // assert response message content
  expect(response.body.msg).toBe('No token; authorization denied')
})

test('Should not create a new comment if an invalid token is provided', async () => {
  // send req to auth protected endpoint
  const response = await request(app)
    .post('/comments/new/1')
    .set('x-auth-token', 'someInvalidToken') // provide invalid token header
    .expect(401) // assert http res code

  // assert response message content
  expect(response.body.msg).toBe('Invalid token; authorization denied')
})

test('Should not create a new relation if no auth token is provided', async () => {
  // send req to auth protected endpoint; do not set any token header
  const response = await request(app)
    .post('/relations/request/1')
    .expect(401) // assert http res code

  // assert response message content
  expect(response.body.msg).toBe('No token; authorization denied')
})

test('Should not delete user when invalid is provided', async () => {
  // dbusers[0] deletes their account; set invalid token header
  const response = await request(app)
    .delete('/users/me')
    .set('x-auth-token', 'someInvalidToken')
    .expect(401)
  
  expect(response.body.msg).toEqual('Invalid token; authorization denied')
 })


test('Should not delete user when no auth token is provideed', async () => {
  // dbusers[0] deletes their account; do not set token header
  const response = await request(app)
    .delete('/users/me')
    .expect(401)
  
  expect(response.body.msg).toEqual('No token; authorization denied')
 })
