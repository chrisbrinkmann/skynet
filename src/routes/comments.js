const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')

// get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll()

    res.status(200).send(comments)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
