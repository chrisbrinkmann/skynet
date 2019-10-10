const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const Relation = require('../src/models/Relation')
const { syncDatabase, tokens, dbUsers } = require('./fixtures/db')

beforeEach(syncDatabase)

/**
 * Send friend request tests
 */

test('Should add new relation when friend id is valid and no relation exists', async () => {
  const response = await request(app)
    .post(`/relations/request/${dbUsers[1].id}`)
    .set('x-auth-token', tokens[0])
    .expect(201) // assert http res code

  const decoded = jwt.verify(tokens[0], process.env.JWT_SECRET)
  const relation = await Relation.findOne({
    where: { first_user_id: decoded.id, second_user_id: dbUsers[1].id }
  })

  // assert the new relation exists in the db
  expect(relation.relationType).toEqual('pending_first_second')
})

test('Should add new relation when friend id is valid, no relation exists, and requestor has a higher id', async () => {
  const response = await request(app)
    .post(`/relations/request/${dbUsers[0].id}`)
    .set('x-auth-token', tokens[1])
    .expect(201) // assert http res code

  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)
  const relation = await Relation.findOne({
    where: { first_user_id: dbUsers[0].id, second_user_id: decoded.id }
  })

  // assert the new relation exists in the db
  expect(relation.relationType).toEqual('pending_second_first')
})

test('Should not add a relation to self', async () => {
  const response = await request(app)
    .post(`/relations/request/${dbUsers[0].id}`) // friend requested
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
  const response = await request(app)
    .post(`/relations/request/${dbUsers[2].id}`) // friend requested
    .set('x-auth-token', tokens[1])
    .expect(409) // assert http res code

  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)
  const relation = await Relation.findOne({
    where: { first_user_id: decoded.id, second_user_id: dbUsers[2].id }
  })

  expect(relation).not.toBeNull() // assert relation between these users exists already

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual(
    'Relation already exists between these users'
  )
})

test('Should not add a relation for a non existant user', async () => {
  const response = await request(app)
    .post(`/relations/request/99`) // friend requested
    .set('x-auth-token', tokens[1])
    .expect(404) // assert http res code

  const decoded = jwt.verify(tokens[1], process.env.JWT_SECRET)
  const relation = await Relation.findOne({
    where: { first_user_id: decoded.id, second_user_id: 99 }
  })

  expect(relation).toBeNull() // assert relation was not inserted to db

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual(
    'User not found'
  )
})

test('Should not add a relation when friend id syntax is invalid (non integer)', async () => {
  const response = await request(app)
    .post(`/relations/request/asdf`) // friend requested
    .set('x-auth-token', tokens[1])
    .expect(400) // assert http res code

  // assert response body message matches expected for this case
  expect(response.body.msg).toEqual('User not found')
})

