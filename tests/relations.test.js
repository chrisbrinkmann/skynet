const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const Relation = require('../src/models/Relation')
const User = require('../src/models/User')
const { syncDatabase, tokens, dbUsers, dbRelations } = require('./fixtures/db')
const { getRelation } = require('../src/utils/utils')

beforeEach(syncDatabase)

/**
 * Send friend request tests
 */

test('Should add new relation when friend id is valid and no relation exists', async () => {
  // cache user object from auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // query db for existing relation between these users
  let relation = await Relation.findOne({
    where: {
      first_user_id: decoded.id,
      second_user_id: dbUsers[2].id
    }
  })
  // assert no relation already exists
  expect(relation).toBeNull()

  // dbUsers[1] sends friend request to dbUsers[2]
  const response = await request(app)
    .post(`/relations/request/${dbUsers[2].id}`)
    .set('x-auth-token', tokens[1])
    .expect(201) // assert http res code

  // query db for new relation
  relation = await Relation.findOne({
    where: {
      first_user_id: decoded.id,
      second_user_id: dbUsers[2].id
    }
  })

  // assert the new relation exists in the db
  expect(relation.relationType).toEqual('pending_first_second')
})

test('Should add new relation when friend id is valid, no relation exists, and requestor has a higher id', async () => {
  // dbUsers[2] sends friend request to dbUsers[1]
  const response = await request(app)
    .post(`/relations/request/${dbUsers[1].id}`)
    .set('x-auth-token', tokens[2])
    .expect(201) // assert http res code

  const decoded = jwt.verify(tokens[2], process.env.JWT_SECRET)
  const relation = await Relation.findOne({
    where: { first_user_id: dbUsers[1].id, second_user_id: decoded.id }
  })

  // assert the new relation exists in the db
  expect(relation.relationType).toEqual('pending_second_first')
})

test('Should not add a relation to self', async () => {
  // dbUsers[0] sends friend request to xerself
  const response = await request(app)
    .post(`/relations/request/${dbUsers[0].id}`)
    .set('x-auth-token', tokens[0])
    .expect(400) // assert http res code

  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)
  const relation = await Relation.findOne({
    where: {
      first_user_id: dbUsers[0].id,
      second_user_id: decoded.id
    }
  })

  expect(relation).toBeNull() // assert no db insertion

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual('Cannot friend request self')
})

test('Should not add a relation when one already already exists between two users', async () => {
  // dbUser[0] sends friend request to dbUsers[1]
  const response = await request(app)
    .post(`/relations/request/${dbUsers[1].id}`)
    .set('x-auth-token', tokens[0])
    .expect(409) // assert http res code

  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)
  const relation = await Relation.findOne({
    where: { first_user_id: decoded.id, second_user_id: dbUsers[1].id }
  })

  expect(relation).not.toBeNull() // assert relation between these users exists already

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual(
    'Relation already exists between these users'
  )
})

test('Should not add a relation for a non existant user', async () => {
  // dbUsers[1] sends friend request to user with id: 99 (does not exist)
  const response = await request(app)
    .post(`/relations/request/99`)
    .set('x-auth-token', tokens[1])
    .expect(404) // assert http res code

  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)
  const relation = await Relation.findOne({
    where: { first_user_id: decoded.id, second_user_id: 99 }
  })

  expect(relation).toBeNull() // assert relation was not inserted to db

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual('User not found')
})

test('Should not add a relation when friend id syntax is invalid (non integer)', async () => {
  // dbUsers[1] sends friend request to user with invalid id: asdf
  const response = await request(app)
    .post(`/relations/request/asdf`)
    .set('x-auth-token', tokens[1])
    .expect(400) // assert http res code

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual('User not found')
})

/**
 * Accept friend request tests
 */

test('Should set relationType to "friends" when pending request is accepted', async () => {
  // cache accepter user object from auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // query db for existing relation between the two users
  let relation = await Relation.findOne({
    where: {
      first_user_id: dbUsers[0].id,
      second_user_id: decoded.id
    }
  })
  // assert the pending friend request exists
  expect(relation.relationType).toBe('pending_first_second')

  // dbUsers[1] accepts pending friend request from dbUsers[0]
  const response = await request(app)
    .patch(`/relations/accept/${dbUsers[0].id}`)
    .set('x-auth-token', tokens[1])
    .expect(201) // assert http res code

  // query db for updated relation
  relation = await Relation.findOne({
    where: {
      first_user_id: dbUsers[0].id,
      second_user_id: decoded.id
    }
  })

  // assert relationType was updated in the db
  expect(relation.relationType).toEqual('friends')

  // assert response body matches expected
  expect(response.body.first_user_id).toEqual(dbUsers[0].id)
  expect(response.body.second_user_id).toEqual(decoded.id)
  expect(response.body.relationType).toEqual('friends')
})

test('Should set relationType to "friends" when pending request is accepted, and accepter has a lower id', async () => {
  // cache accepter user object from auth token payload
  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)

  // query db for existing relation between the two users
  let relation = await Relation.findOne({
    where: {
      first_user_id: decoded.id,
      second_user_id: dbUsers[2].id
    }
  })
  // assert the pending friend request exists
  expect(relation.relationType).toBe('pending_second_first')

  // dbUsers[0] accepts pending friend request from dbUsers[2]
  const response = await request(app)
    .patch(`/relations/accept/${dbUsers[2].id}`)
    .set('x-auth-token', tokens[0])
    .expect(201) // assert http res code

  // query db for updated relation
  relation = await Relation.findOne({
    where: {
      first_user_id: decoded.id,
      second_user_id: dbUsers[2].id
    }
  })

  // assert relationType was updated in the db
  expect(relation.relationType).toEqual('friends')

  // assert response body matches expected
  expect(response.body.first_user_id).toEqual(decoded.id)
  expect(response.body.second_user_id).toEqual(dbUsers[2].id)
  expect(response.body.relationType).toEqual('friends')
})

test('Should not add friend when no pending request exists', async () => {
  // cache accepter user object from auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // query db for pending friend request
  let relation = await Relation.findOne({
    where: {
      first_user_id: decoded.id,
      second_user_id: dbUsers[2].id,
      relationType: 'pending_second_first'
    }
  })
  expect(relation).toBeNull() // assert no pending friend request exists

  // dbUsers[1] tries to accept a non existant friend request from dbUsers[2]
  const response = await request(app)
    .patch(`/relations/accept/${dbUsers[2].id}`)
    .set('x-auth-token', tokens[1])
    .expect(404) // assert http res code

  // query db for updated relation
  relation = await Relation.findOne({
    where: {
      first_user_id: decoded.id,
      second_user_id: dbUsers[2].id,
      relationType: 'friends'
    }
  })
  expect(relation).toBeNull() // assert friends relation was not added to db

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual('Pending friend request not found')
})

test('Should not accept request from non existant user', async () => {
  // dbUsers[1] accepts friend request from user with id: 99 (does not exist)
  const response = await request(app)
    .patch(`/relations/accept/99`)
    .set('x-auth-token', tokens[1])
    .expect(404) // assert http res code

  // cache accepter user object from auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // query db for relation with non existant user
  const relation = await Relation.findOne({
    where: { first_user_id: decoded.id, second_user_id: 99 }
  })

  expect(relation).toBeNull() // assert no relation in db with non existant user

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual('User not found')
})

test('Should not accept request when friend id syntax is invalid (non integer)', async () => {
  // dbUsers[1] accepts friend request from user with invalid id: asdf
  const response = await request(app)
    .patch(`/relations/accept/asdf`)
    .set('x-auth-token', tokens[1])
    .expect(400) // assert http res code

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual('User not found')
})

/**
 * Delete relation (deny friend request, unfriend) endpoint tests
 */

test('Should delete relation when pending friend request from valid user is denied', async () => {
  // cache req user object from auth token payload
  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)

  // query db for existing relation
  let relation = await getRelation(decoded.id, dbUsers[0].id)

  // assert existing relation is pending friend request
  expect(relation.dataValues.relationType).toEqual('pending_first_second')

  // dbUsers[1] denies friend request from dbUsers[0]
  const response = await request(app)
    .delete(`/relations/${dbUsers[0].id}`)
    .set('x-auth-token', tokens[1])
    .expect(200) // assert http res code

  // query db for relation between to users
  relation = await getRelation(decoded.id, dbUsers[0].id)

  // assert no relation exists between to users
  expect(relation).toBeNull()

  // assert response body message matches expected
  expect(response.body.msg).toEqual('Relation deleted')
})

test('Should delete relation when a friend is unfriended', async () => {
  // cache req user object from auth token payload
  const decoded = jwt.verify(tokens[2], process.env.JWT_SECRET)

  // query db for existing relation
  let relation = await getRelation(decoded.id, dbUsers[4].id)

  // assert existing relation is 'friends'
  expect(relation.dataValues.relationType).toEqual('friends')

  // dbUsers[2] unfriends dbUsers[4]
  const response = await request(app)
    .delete(`/relations/${dbUsers[4].id}`)
    .set('x-auth-token', tokens[2])
    .expect(200) // assert http res code

  // query db for relation between to users
  relation = await getRelation(decoded.id, dbUsers[4].id)

  // assert no relation exists between to users
  expect(relation).toBeNull()

  // assert response body message matches expected
  expect(response.body.msg).toEqual('Relation deleted')
})

test('Should send applicable http response when deleting relation with non existant user', async () => {
  // cache req user object from auth token payload
  const decoded = jwt.verify(tokens[3], process.env.JWT_SECRET)

  // query db for user with id 99
  const user = await User.findOne({ where: { id: 99 } })

  // assert no user with this id exists
  expect(user).toBeNull()

  // dbUsers[3] deletes relation with user with id: 99
  const response = await request(app)
    .delete(`/relations/99`)
    .set('x-auth-token', tokens[3])
    .expect(404) // assert http res code

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('User not found')
})

test('Should send applicable http response when deleting non existant relation', async () => {
  // cache req user object from auth token payload
  const decoded = jwt.verify(tokens[3], process.env.JWT_SECRET)

  // query db for attempted deleted relation
  const relation = await getRelation(decoded.id, dbUsers[4].id)

  // assert no relation between users exists
  expect(relation).toBeNull()

  // dbUsers[3] deletes relation with dbUsers[4]
  const response = await request(app)
    .delete(`/relations/${dbUsers[4].id}`)
    .set('x-auth-token', tokens[3])
    .expect(404) // assert http res code

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('Relation between users not found')
})

test('Should send applicable http response when delete relation id syntax is invalid (non integer)', async () => {
  // dbUsers[2] deletes relation with id: asdf
  const response = await request(app)
    .delete(`/relations/asdf`)
    .set('x-auth-token', tokens[2])
    .expect(400) // assert http res code

  // assert http response msg to match expected
  expect(response.body.msg).toEqual('User not found')
})
