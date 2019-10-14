const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const User = require('../models/User')
const Relation = require('../models/Relation')
const { check } = require('express-validator')

// returns a JsonWebToken as a string
const createAuthToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })
}

// create a User model instance and insert into DB
const createUser = async (name, email, password, avatar) => {
  return User.create({
    name,
    email,
    password,
    avatar
  })
}

// returns array of express-validator checks
const registerValidatorChecks = () => {
  return [
    check('name', 'Name is required')
      .trim()
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ]
}

// returns an array off express-validator checks
const loginValidatorChecks = () => {
  return [
    check('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
  ]
}

const contentValidatorChecks = () => {
  return [
    check('content', 'content is required')
      .not()
      .isEmpty()
  ]
}

// generate a url for an avatar
const setAvatar = email => {
  return gravatar.url(email, {
    s: '200', // size
    r: 'pg', // rating
    d: 'mp' // default img, if none from email
  })
}

// returns a properly formatted object for insertion to relations table
const formatPendingRelation = (requester, requestee, relationType) => {
  // cache variables; assume requester has the lower id
  let relationData = {
    first_user_id: requester,
    second_user_id: requestee,
    relationType
  }
  // if requester has the higher id; swap user positions and relation type
  if (requester > requestee) {
    relationData.first_user_id = requestee
    relationData.second_user_id = requester
    relationData.relationType = 'pending_second_first'
  }

  return relationData
}

// return true if two users have a friends relation
const areFriends = async (first_user_id, second_user_id) => {
  // query db for relation
  const relation = await getRelation(first_user_id, second_user_id)

  // return false if there is no friends relation
  if (!relation || relation.dataValues.relationType !== 'friends') return false

  return true
}

// query db for existing relation between to users; return the relation or null if none
const getRelation = async (first_user_id, second_user_id) => {
  // cache user id parameters
  let relationData = {
    first_user_id,
    second_user_id
  }

  // format relation so first_user_is is the lower of the two
  if (first_user_id > second_user_id) {
    relationData.first_user_id = second_user_id
    relationData.second_user_id = first_user_id
  }

  // query db for the relation
  const relation = await Relation.findOne({
    where: relationData
  })

  return relation
}

module.exports = {
  createAuthToken,
  createUser,
  registerValidatorChecks,
  loginValidatorChecks,
  contentValidatorChecks,
  setAvatar,
  formatPendingRelation,
  areFriends,
  getRelation
}
