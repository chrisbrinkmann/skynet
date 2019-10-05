const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const { syncDatabase, populateTables, sampleUsers } = require('./fixtures/db')

beforeAll(syncDatabase)
beforeEach(populateTables)

/**
 * Register user endpoint tests
 */

test('Should register/insert new user when data is valid', async () => {
  const response = await request(app)
    .post('/users/register')
    .send({
      name: 'New User',
      email: 'newuser@example.com',
      password: '123456'
    })
    .expect(201) // assert http res code

  const user = await User.findOne({ where: { email: 'newuser@example.com' } })
  expect(user).not.toBeNull() // assert db insertion success

  // assert response object contains token
  expect(response.body.hasOwnProperty('token')).toBeTruthy()

  // assert plaintext pw not stored in db
  expect(user.password).not.toBe('123456')
})

test('Should not register existing user', async () => {
  await request(app)
    .post('/users/register')
    .send(sampleUsers[0])
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: sampleUsers[0].email } })
  expect(user).not.toBeNull() // confirm registering user exists in db
})

test('Should not register a new user when name is empty', async () => {
  await request(app)
    .post('/users/register')
    .send({
      name: '',
      email: 'newuser@example.com',
      password: '123456'
    })
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: 'newuser@example.com' } })
  expect(user).toBeNull() // assert no db insertion
})

test('Should not register a new user when email syntax is invalid ', async () => {
  await request(app)
    .post('/users/register')
    .send({
      name: 'New User',
      email: 'newuserexample.com',
      password: '123456'
    })
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: 'newuserexample.com' } })
  expect(user).toBeNull() // assert no db insertion
})

test('Should not register a new user when password is too short', async () => {
  await request(app)
    .post('/users/register')
    .send({
      name: 'New User',
      email: 'newuser@example.com',
      password: '12345'
    })
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: 'newuser@example.com' } })
  expect(user).toBeNull() // assert no db insertion
})

/**
 * Login user endpoint tests
 */

test('Should login an existing user when credentials are valid', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: sampleUsers[0].email,
      password: sampleUsers[0].password
    })
    .expect(200) // assert http res code

  const user = await User.findOne({ where: { email: sampleUsers[0].email } })
  expect(user).not.toBeNull() // confirm login user exists in db

  // assert response object contains token
  expect(response.body.hasOwnProperty('token')).toBeTruthy()
})

test('Should not login an existing user when password is wrong', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: sampleUsers[1].email,
      password: 'wrongpassword'
    })
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: sampleUsers[1].email } })
  expect(user).not.toBeNull() // confirm login user exists in db

  // assert response object does not contain token
  expect(response.body.hasOwnProperty('token')).toBeFalsy()
})

test('Should not login a non existant user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: 'fakeuser@example.com',
      password: '123456'
    })
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: 'fakeuser@example.com' } })
  expect(user).toBeNull() // confirm login user not in db

  // assert response object does not contain token
  expect(response.body.hasOwnProperty('token')).toBeFalsy()
})
