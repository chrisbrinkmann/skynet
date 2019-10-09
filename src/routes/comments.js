const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const { validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const { contentValidatorChecks } = require('../utils/utils')

// create new comment
router.post(
  '/new/:post_id',
  [auth, contentValidatorChecks()],
  async (req, res) => {
    const errors = validationResult(req) // run checks on req
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // confirm post to comment on exists in db
      const post = await Post.findOne({ where: { id: req.params.post_id } })

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' })
      }

      // insert the comment into the db
      const comment = await Comment.create({
        user_id: req.user.id,
        post_id: req.params.post_id,
        content: req.body.content
      })

      res.status(201).json(comment)
    } catch (err) {
      if (err.kind === 'ObjectId') {
        // this message will trigger iff err is from an invalid post id
        return res.status(404).json({ msg: 'Post not found' })
      }
      res.status(500).send('Server Error')
    }
  }
)

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
