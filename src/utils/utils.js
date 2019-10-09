const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const User = require('../models/User')
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

const createPostValidatorChecks = () => {
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

module.exports = {
  createAuthToken,
  createUser,
  registerValidatorChecks,
  loginValidatorChecks,
  createPostValidatorChecks,
  setAvatar
}
