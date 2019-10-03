const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const { syncDatabase, populateTables } = require('./fixtures/db')

beforeAll(syncDatabase)
beforeEach(populateTables)

/**
 * Register user endpoint tests
 */

test('Should register/insert new user when data is valid', async () => {
  const response = await request(app)
    .post('/users/register')
    .send({
      name: 'Chris',
      email: 'chris@example.com',
      password: '123456'
    })
    .expect(201) // assert http res code

  const user = await User.findOne({ where: { email: 'chris@example.com' } })
  expect(user).not.toBeNull() // assert db insertion success

  // assert response object contains token
  expect(response.body.hasOwnProperty('token')).toBeTruthy()

  // assert plaintext pw not stored in db
  expect(user.password).not.toBe('123456')
})

test('Should not register existing user', async () => {
  await request(app)
    .post('/users/register')
    .send({
      name: 'Joni Stubbs',
      email: 'jstubbs@example.com',
      password: '123456'
    })
    .expect(400) // assert http res code
})

test('Should not register user when name is empty', async () => {
  await request(app)
    .post('/users/register')
    .send({
      name: '',
      email: 'chris@example.com',
      password: '123456'
    })
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: 'chris@example.com' } })
  expect(user).toBeNull() // assert no db insertion
})

test('Should not register user when email syntax is invalid ', async () => {
  await request(app)
    .post('/users/register')
    .send({
      name: 'Chris',
      email: 'chrisexample.com',
      password: '123456'
    })
    .expect(400) // assert http res code
  
  const user = await User.findOne({ where: { email: 'chris@example.com' } })
  expect(user).toBeNull() // assert no db insertion
})

test('Should not register user when password is too short', async () => {
  await request(app)
    .post('/users/register')
    .send({
      name: 'Chris',
      email: 'chrisexample.com',
      password: '12345'
    })
    .expect(400) // assert http res code
  
  const user = await User.findOne({ where: { email: 'chris@example.com' } })
  expect(user).toBeNull() // assert no db insertion
})
