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
  loginValidatorChecks,
  fieldValidatorChecks,
  emailValidatorChecks,
  passwordValidatorChecks,
  getFriendsCount,
  areFriends,
  populateUserPosts
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
    let user = await User.findOne({ where: { email }, attributes: ['id'] })

    if (user) {
      return res.status(400).json({
        errors: [{ msg: 'A user with that email already exists' }]
      })
    }

    const avatar = setAvatar(email) // set profile pic avatar

    password = await bcrypt.hash(password, 8)

    // insert user to db
    user = await createUser(name, email, password, avatar)

    // cache user id as token payload
    const payload = {
      id: user.id
    }

    // create the auth token using the payload
    const token = createAuthToken(payload)

    res.status(201).json({ token })
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
    let user = await User.findOne({
      where: { email },
      attributes: ['id', 'password']
    })

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

    // cache user id as token payload
    const payload = {
      id: user.id
    }

    // create the auth token using the payload
    const token = createAuthToken(payload)

    res.status(200).json({ token })
  } catch (err) {
    res.status(400).send(err)
  }
})

// get all users
router.get('/', auth, async (req, res) => {
  try {
    let users = await User.findAll({ attributes: { exclude: ['password'] } })

    res.status(200).json(users)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// get user profile
router.get('/profile/:user_id', auth, async (req, res) => {
  try {
    // confirm user to get profile for exists in db
    const user = await User.findOne({
      where: { id: req.params.user_id },
      attributes: ['id', 'name', 'avatar', 'bio']
    })

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    // create profile object to return to client
    let profile = {
      id: user.id,
      name: user.name,
      avatar: user.avatar
    }

    // if req user is getting own or friends profile,
    // include the requested users bio, #friends, and posts
    if (req.user.id === user.id || (await areFriends(req.user.id, user.id))) {
      profile.bio = user.bio
      profile.num_friends = await getFriendsCount(user.id)
      profile.posts = await populateUserPosts(user.id)
    }

    res.status(200).json(profile)
  } catch (err) {
    if (err.message.match(/^(invalid input syntax for integer)/)) {
      // this message will trigger iff non integer is put in req param
      return res.status(400).json({ msg: 'User not found' })
    }
    res.status(500).send('Server Error')
  }
})

// update user name
router.patch(
  '/name',
  [auth, fieldValidatorChecks('name')],
  async (req, res) => {
    const errors = validationResult(req) // run checks on req
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name } = req.body // cache req data

    try {
      // query db for req user
      let user = await User.findOne({
        where: { id: req.user.id },
        attributes: ['id']
      })

      // update user name; insert to db
      user = await user.update({
        name
      })

      res.status(200).json({ msg: `Your name has been updated to: '${name}'` })
    } catch (err) {
      res.status(500).send('Server Error')
    }
  }
)

// update user bio
router.patch('/bio', [auth, fieldValidatorChecks('bio')], async (req, res) => {
  const errors = validationResult(req) // run checks on req
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { bio } = req.body // cache req data

  try {
    // query db for req user
    let user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id']
    })

    // update user bio; insert to db
    user = await user.update({
      bio
    })

    res.status(200).json({ msg: `Your bio has been updated to: '${bio}'` })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// update user email (also updates gravatar email)
router.patch('/email', [auth, emailValidatorChecks()], async (req, res) => {
  const errors = validationResult(req) // run checks on req
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email } = req.body // cache req data

  try {
    // query db for req user
    let user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id']
    })

    // update user email, avater; insert to db
    user = await user.update({
      email,
      avatar: setAvatar(email)
    })

    res.status(200).json({ msg: `Your email has been updated to: '${email}'` })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// update user password
router.patch(
  '/password',
  [auth, passwordValidatorChecks()],
  async (req, res) => {
    const errors = validationResult(req) // run checks on req
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let { password } = req.body // cache req data

    try {
      // query db for req user
      let user = await User.findOne({
        where: { id: req.user.id },
        attributes: ['id']
      })

      // encrypt the new password
      password = await bcrypt.hash(password, 8)

      // update the user password, insert to db
      user = await user.update({
        password
      })

      res.status(200).json({ msg: `Your password has been updated` })
    } catch (err) {
      res.status(500).send('Server Error')
    }
  }
)

// delete account
router.delete('/me', auth, async (req, res) => {
  try {
    // query db for req user
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id']
    })

    // delete user from db
    await user.destroy()

    res.status(200).json({ msg: 'Hasta la vista, baby' })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

module.exports = router
