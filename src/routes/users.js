const express = require('express')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const {
  setAvatar,
  createAuthToken,
  createUser,
  registerValidatorChecks,
  loginValidatorChecks
} = require('../utils/utils')

// register a new user, returns a JWT
router.post('/register', registerValidatorChecks(), async (req, res) => {
  const errors = validationResult(req) // run checks on req
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let { name, email, password } = req.body // cache req data

  try {
    // check for existing users with req email
    let user = await User.findOne({ where: { email } })

    if (user) {
      return res.status(400).json({
        errors: [{ msg: 'A user with that email already exists' }]
      })
    }

    const avatar = setAvatar(email) // set profile pic avatar

    password = await bcrypt.hash(password, 8)

    // insert user to db
    user = await createUser(name, email, password, avatar)

    const token = createAuthToken(user.dataValues)

    res.status(201).json({ token }) // send token res
  } catch (err) {
    res.status(400).send(err)
  }
})

// login existing user
router.post('/login', loginValidatorChecks(), async (req, res) => {
  const errors = validationResult(req) // run checks on req
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body // cache req data

  try {
    // check for existing user with req email
    let user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(400).json({
        errors: [{ msg: 'Invalid credentials' }]
      })
    }

    // compare req password with user password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        errors: [{ msg: 'Invalid credentials' }]
      })
    }

    const token = createAuthToken(user.dataValues)

    res.status(200).json({ token }) // send token res
  } catch (err) {
    res.status(400).send(err)
  }
})

// get all users
router.get('/', auth, async (req, res) => {
  try {
    let users = await User.findAll({ attributes: { exclude: ['password']}})

    res.status(200).json(users)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
