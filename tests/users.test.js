const request = require('supertest')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const User = require('../src/models/User')
const Relation = require('../src/models/Relation')
const Post = require('../src/models/Post')
const Comment = require('../src/models/Comment')
const {
  syncDatabase,
  sampleUserData,
  dbUsers,
  tokens
} = require('./fixtures/db')
const { areFriends } = require('../src/utils/utils')

beforeEach(syncDatabase)

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
    .send(sampleUserData[0])
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: sampleUserData[0].email } })
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
      email: sampleUserData[0].email,
      password: sampleUserData[0].password
    })
    .expect(200) // assert http res code

  const user = await User.findOne({ where: { email: sampleUserData[0].email } })
  expect(user).not.toBeNull() // confirm login user exists in db

  // assert response object contains token
  expect(response.body.hasOwnProperty('token')).toBeTruthy()
})

test('Should not login an existing user when password is wrong', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: sampleUserData[1].email,
      password: 'wrongpassword'
    })
    .expect(400) // assert http res code

  const user = await User.findOne({ where: { email: sampleUserData[1].email } })
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

/**
 * Delete user account endpoint tests
 */

test('Should delete user when auth token is valid', async () => {
  // dbusers[0] deletes their account
  const response = await request(app)
    .delete('/users/me')
    .set('x-auth-token', tokens[0])
    .expect(200)

  // assert response body msg matches expected
  expect(response.body.msg).toEqual('Hasta la vista, baby')
})

test('Should delete all users relations when user is deleted', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // query db for relations of dbUsers[1]
  let relations = await Relation.findAll({
    where: {
      [Op.or]: [
        { first_user_id: { [Op.eq]: decoded.id } },
        { second_user_id: { [Op.eq]: decoded.id } }
      ]
    }
  })

  // assert existence of 3 relations for dbUsers[1]
  expect(relations.length).toBe(3)

  // dbusers[1] deletes their account
  const response = await request(app)
    .delete('/users/me')
    .set('x-auth-token', tokens[1])
    .expect(200)

  //query db for relations of dbUsers[1]
  relations = await Relation.findAll({
    where: {
      [Op.or]: [
        { first_user_id: { [Op.eq]: decoded.id } },
        { second_user_id: { [Op.eq]: decoded.id } }
      ]
    }
  })

  // assert relations of deleted user no longer exist
  expect(relations).toEqual([])

  // assert response body msg matches expected
  expect(response.body.msg).toEqual('Hasta la vista, baby')
})

test('Should delete all users posts when user is deleted', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[4], process.env.JWT_SECRET)

  // query db for posts of dbUsers[4]
  let posts = await Post.findAll({ where: { user_id: decoded.id } })

  // assert existence of 2 posts for dbUsers[4]
  expect(posts.length).toBe(2)

  // dbusers[4] deletes their account
  const response = await request(app)
    .delete('/users/me')
    .set('x-auth-token', tokens[4])
    .expect(200)

  // query db for posts of dbUsers[4]
  posts = await Post.findAll({ where: { user_id: decoded.id } })

  // assert posts of deleted user no longer exist
  expect(posts).toEqual([])

  // assert response body msg matches expected
  expect(response.body.msg).toEqual('Hasta la vista, baby')
})

test('Should delete all users comments when user is deleted', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[4], process.env.JWT_SECRET)

  // query db for comments of dbUsers[4]
  let comments = await Comment.findAll({ where: { user_id: decoded.id } })

  // assert existence of 2 comments for dbUsers[4]
  expect(comments.length).toBe(2)

  // dbusers[4] deletes their account
  const response = await request(app)
    .delete('/users/me')
    .set('x-auth-token', tokens[4])
    .expect(200)

  // query db for comments of dbUsers[4]
  comments = await Comment.findAll({ where: { user_id: decoded.id } })

  // assert comments of deleted user no longer exist
  expect(comments).toEqual([])

  // assert response body msg matches expected
  expect(response.body.msg).toEqual('Hasta la vista, baby')
})

/**
 * Get profile endpoint tests
 */

test('Should return full profile data when users own id is provided', async () => {
  // dbUsers[0] gets their own profile
  const response = await request(app)
    .get(`/users/profile/${dbUsers[0].id}`)
    .set('x-auth-token', tokens[0])
    .expect(200) // assert http res code

  // assert http res body matches expected
  expect(response.body).toHaveProperty('id')
  expect(response.body).toHaveProperty('name')
  expect(response.body).toHaveProperty('avatar')
  expect(response.body).toHaveProperty('bio')
  expect(response.body).toHaveProperty('num_friends')
  expect(response.body).toHaveProperty('posts')

  // assert all posts belong to requested user
  response.body.posts.forEach(post => {
    expect(post.user_id).toEqual(dbUsers[0].id)
  })
})

test('Should return full profile data when users friend id is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // assert that dbUsers[0] and dbUsers[3] are friends
  expect(await areFriends(decoded.id, dbUsers[3].id)).toBeTruthy()

  // dbUsers[0] gets dbUsers[3] profile
  const response = await request(app)
    .get(`/users/profile/${dbUsers[3].id}`)
    .set('x-auth-token', tokens[0])
    .expect(200) // assert http res code

  // assert http res body matches expected
  expect(response.body).toHaveProperty('id')
  expect(response.body).toHaveProperty('name')
  expect(response.body).toHaveProperty('avatar')
  expect(response.body).toHaveProperty('bio')
  expect(response.body).toHaveProperty('num_friends')
  expect(response.body).toHaveProperty('posts')

  // assert all posts belong to requested user
  response.body.posts.forEach(post => {
    expect(post.user_id).toEqual(dbUsers[3].id)
  })
})

test('Should return limited profile data when valid non friend id is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // assert that dbUsers[0] and dbUsers[1] are not friends
  expect(await areFriends(decoded.id, dbUsers[1].id)).toBeFalsy()

  // dbUsers[0] gets dbUsers[1] profile
  const response = await request(app)
    .get(`/users/profile/${dbUsers[1].id}`)
    .set('x-auth-token', tokens[0])
    .expect(200) // assert http res code
  
    // assert http res body matches expected
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('avatar')
    expect(response.body).not.toHaveProperty('bio')
    expect(response.body).not.toHaveProperty('num_friends')
    expect(response.body).not.toHaveProperty('posts')
})

test('Should not get profile for non existant user', async () => {
// dbUsers[0] gets profile for user with id 99 (does not exist)
  const response = await request(app)
    .get(`/users/profile/99`)
    .set('x-auth-token', tokens[0])
    .expect(404) // assert http res code
  
  // assert response body message matches expected
  expect(response.body.msg).toEqual('User not found')
})

test('Should not get profile when user id syntax is invalid (non integer)', async () => {
  // dbUsers[0] gets profile for user with invalid id: asdf (does not exist)
    const response = await request(app)
      .get(`/users/profile/asdf`)
      .set('x-auth-token', tokens[0])
      .expect(400) // assert http res code
    
    // assert response body message matches expected
    expect(response.body.msg).toEqual('User not found')
  })