const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

// get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll()

    res.status(200).send(posts)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
