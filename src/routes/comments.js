const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const { validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const { contentValidatorChecks, areFriends } = require('../utils/utils')

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

      // confirm commenter and poster are friends
      const friends = await areFriends(req.user.id, post.dataValues.user_id)

      // only allow friends or post owner to comment
      if (!friends && req.user.id !== post.dataValues.user_id) {
        return res
          .status(401)
          .json({ msg: 'Only post owner and friends of owner can comment' })
      }

      // insert the comment into the db
      const comment = await Comment.create({
        user_id: req.user.id,
        post_id: req.params.post_id,
        content: req.body.content
      })

      res.status(201).json(comment)
    } catch (err) {
      if (err.message.match(/^(invalid input syntax for integer)/)) {
        // this message will trigger if non integer is put in req param
        return res.status(400).json({ msg: 'Post not found' })
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

// delete a comment
router.delete('/:comment_id', auth, async (req, res) => {
  try {
    // confirm comment to delete exists in db
    const comment = await Comment.findOne({
      where: { id: req.params.comment_id }
    })

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' })
    }

    // cache the post that the comment belongs to
    const post = await Post.findOne({
      where: { id: comment.dataValues.post_id }
    })

    // confirm either comment or the post is owned by the deleter
    if (
      comment.dataValues.user_id !== req.user.id &&
      post.dataValues.user_id !== req.user.id
    ) {
      return res
        .status(401)
        .json({ msg: 'Only post or comment owner can delete comments' })
    }

    // delete the comment from the db
    await comment.destroy({ force: true })

    res.status(200).json({ msg: 'Comment deleted' })
  } catch (err) {
    if (err.message.match(/^(invalid input syntax for integer)/)) {
      // this message will trigger if non integer is put in req param
      return res.status(400).json({ msg: 'Comment not found' })
    }
    res.status(500).send('Server Error')
  }
})

module.exports = router
