const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator')
const Post = require('../models/Post')
const auth = require('../middleware/auth')
const { createPostValidatorChecks } = require('../utils/utils')

// create new post
router.post('/new', [auth, createPostValidatorChecks()], async (req, res) => {
    const errors = validationResult(req) // run checks on req
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  
  try {
    // insert post into the db
    const post = await Post.create({
      user_id: req.user.id,
      content: req.body.content
    })

    res.status(201).json(post)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.findAll()

    res.status(200).send(posts)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
