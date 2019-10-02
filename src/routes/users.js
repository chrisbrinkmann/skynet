const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const User = require('../models/User')

// register a new user
router.post(
  '/register',
  [
    // validator checks
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
  ],
  async (req, res) => {
    const errors = validationResult(req) // run checks on req
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let { name, email, password } = req.body

    try {
      let user = await User.findOne({ where: { email } })

      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'A user with that email already exists' }]
        })
      }

      // get users gravatar using email
      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mp' // default img, if none from email
      })

      // encrypt pw
      password = await bcrypt.hash(password, 8)

      // insert user to the db
      user = await User.create({
        name,
        email,
        password,
        avatar
      })

      // create auth token
      jwt.sign(
        user.dataValues,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err
          // send token back in res.body
          res.status(200).json({ token })
        }
      )
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()

    res.status(200).json(users)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router