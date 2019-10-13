const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator')
const Post = require('../models/Post')
const auth = require('../middleware/auth')
const { contentValidatorChecks } = require('../utils/utils')

// create new post
router.post('/new', [auth, contentValidatorChecks()], async (req, res) => {
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

// delete post
router.delete('/:post_id', auth, async (req, res) => {
  try {
    // confirm post to delete exists in db
    const post = await Post.findOne({ where: { id: req.params.post_id } })

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // confirm deleter owns the post to delete
    if (req.user.id !== post.dataValues.user_id) {
      return res.status(401).json({ msg: 'Cannot delete another users post'})
    }

    // delete the post from the db
    await post.destroy({ force: true })
    
    res.status(200).json({ msg: 'Post deleted' })
  } catch (err) {
    if (err.message.match(/^(invalid input syntax for integer)/)) {
      // this message will trigger if non integer is put in req param
      return res.status(400).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

module.exports = router
