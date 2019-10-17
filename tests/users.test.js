const request = require('supertest')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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

/**
 * Update user endpoint tests
 */

test('Should update users name when name is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for dbUser[0]
  let user = await User.findOne({ where: { id: decoded.id } })

  // assert dbUsers[0] name before update
  expect(user.dataValues.name).toEqual('Chris')

  // dbUsers[0] updates their name
  const response = await request(app)
    .patch('/users/name')
    .set('x-auth-token', tokens[0])
    .send({ name: 'Art Vandalay' })
    .expect(200) // assert http res code

  // query db for updated user
  user = await User.findOne({ where: { id: decoded.id } })

  // assert updated user name was inserted to db
  expect(user.dataValues.name).toEqual('Art Vandalay')

  // assert response body message matches expected
  expect(response.body.msg).toEqual(
    `Your name has been updated to: 'Art Vandalay'`
  )
})

test('Should not update users name when no name is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for dbUser[0]
  let user = await User.findOne({ where: { id: decoded.id } })

  // assert dbUsers[0] name before update
  expect(user.dataValues.name).toEqual('Chris')

  // dbUsers[0] updates their name
  const response = await request(app)
    .patch('/users/name')
    .set('x-auth-token', tokens[0])
    .send({ name: '' })
    .expect(400) // assert http res code

  // query db for attempted updated user
  user = await User.findOne({ where: { id: decoded.id } })

  // assert user name in db remains the same
  expect(user.dataValues.name).toEqual('Chris')

  // assert response body matches expected
  expect(response.body).toHaveProperty('errors')
})

test('Should update users bio when bio is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for dbUser[0]
  let user = await User.findOne({ where: { id: decoded.id } })

  // assert dbUsers[0] bio before update
  expect(user.dataValues.bio).toBeNull()

  // dbUsers[0] updates their bio
  const response = await request(app)
    .patch('/users/bio')
    .set('x-auth-token', tokens[0])
    .send({ bio: 'I am an importer/exporter' })
    .expect(200) // assert http res code

  // query db for updated user
  user = await User.findOne({ where: { id: decoded.id } })

  // assert updated user bio was inserted to db
  expect(user.dataValues.bio).toEqual('I am an importer/exporter')

  // assert response body message matches expected
  expect(response.body.msg).toEqual(
    `Your bio has been updated to: 'I am an importer/exporter'`
  )
})

test('Should not update users bio when no bio is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for dbUser[0]
  let user = await User.findOne({ where: { id: decoded.id } })

  // assert dbUsers[0] bio before update
  expect(user.dataValues.bio).toBeNull()

  // dbUsers[0] updates their bio
  const response = await request(app)
    .patch('/users/bio')
    .set('x-auth-token', tokens[0])
    .send({ bio: '' })
    .expect(400) // assert http res code

  // query db for attempted updated user
  user = await User.findOne({ where: { id: decoded.id } })

  // assert user bio in db remains the same
  expect(user.dataValues.bio).toBeNull()

  // assert response body matches expected
  expect(response.body).toHaveProperty('errors')
})

test('Should update users email when valid email is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for dbUser[0]
  let user = await User.findOne({ where: { id: decoded.id } })

  // assert dbUsers[0] email before update
  expect(user.dataValues.email).toEqual('chris@example.com')

  // dbUsers[0] updates their email
  const response = await request(app)
    .patch('/users/email')
    .set('x-auth-token', tokens[0])
    .send({ email: 'stevejobs@skynet.com' })
    .expect(200) // assert http res code

  // query db for updated user
  user = await User.findOne({ where: { id: decoded.id } })

  // assert updated user email was inserted to db
  expect(user.dataValues.email).toEqual('stevejobs@skynet.com')

  // assert response body message matches expected
  expect(response.body.msg).toEqual(
    `Your email has been updated to: 'stevejobs@skynet.com'`
  )
})

test('Should not update users email when invalid email is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for dbUser[0]
  let user = await User.findOne({ where: { id: decoded.id } })

  // assert dbUsers[0] email before update
  expect(user.dataValues.email).toEqual('chris@example.com')

  // dbUsers[0] updates their email with invalid address
  const response = await request(app)
    .patch('/users/email')
    .set('x-auth-token', tokens[0])
    .send({ email: 'invalidemail.com' })
    .expect(400) // assert http res code

  // query db for attempted updated user
  user = await User.findOne({ where: { id: decoded.id } })

  // assert previous email in db remains the same
  expect(user.dataValues.email).toEqual('chris@example.com')

  // assert response body matches expected
  expect(response.body).toHaveProperty('errors')
})

test('Should update users password when valid password is provided', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for dbUser[0]
  let user = await User.findOne({ where: { id: decoded.id } })

  // assert dbUsers[0] password ('123456') hash is in db before update
  expect(
    await bcrypt.compare(sampleUserData[0].password, user.password)
  ).toBeTruthy()

  // dbUsers[0] updates their password
  const response = await request(app)
    .patch('/users/password')
    .set('x-auth-token', tokens[0])
    .send({ password: 'asdf1234' })
    .expect(200) // assert http res code

  // query db for updated user
  user = await User.findOne({ where: { id: decoded.id } })

  // assert updated password hash is now stored in db
  expect(await bcrypt.compare('asdf1234', user.password)).toBeTruthy()

  // assert response body message matches expected
  expect(response.body.msg).toEqual(`Your password has been updated`)
})

test('Should not update users password when password is too short', async () => {
  // cache the req user object from the auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for dbUser[0]
  let user = await User.findOne({ where: { id: decoded.id } })

  // assert dbUsers[0] password ('123456') hash is in db before update
  expect(
    await bcrypt.compare(sampleUserData[0].password, user.password)
  ).toBeTruthy()

  // dbUsers[0] updates their password with password that is too short
  const response = await request(app)
    .patch('/users/password')
    .set('x-auth-token', tokens[0])
    .send({ password: '12345' })
    .expect(400) // assert http res code

  // query db for attempted updated user
  user = await User.findOne({ where: { id: decoded.id } })

  // assert previous password in db remains the same
  expect(
    await bcrypt.compare(sampleUserData[0].password, user.password)
  ).toBeTruthy()

  // assert response body matches expected
  expect(response.body).toHaveProperty('errors')
})
