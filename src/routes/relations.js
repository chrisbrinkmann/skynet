const express = require('express')
const router = express.Router()
const Relation = require('../models/Relation')
const User = require('../models/User')
const auth = require('../middleware/auth')
const { formatPendingRelation, getRelation, populateFriendsList } = require('../utils/utils')

// send friend request
router.post('/request/:friend_id', auth, async (req, res) => {
  try {
    // confirm requested friend exists in db
    const friend = await User.findOne({
      where: { id: req.params.friend_id },
      attributes: ['id']
    })

    if (!friend) {
      return res.status(404).json({ msg: 'User not found' })
    }

    // check user is not requesting xerself
    if (req.user.id === parseInt(req.params.friend_id)) {
      return res.status(400).json({ msg: 'Cannot friend request self' })
    }

    // format relation to pass db schema validation
    // if requestor has the higher id; swap user positions and change relation type
    const relationData = formatPendingRelation(
      req.user.id, // requestor
      req.params.friend_id, // accepter
      'pending_first_second'
    )

    // confirm relation does not already exist in db
    const existingRelation = await Relation.findOne({
      where: {
        first_user_id: relationData.first_user_id,
        second_user_id: relationData.second_user_id
      }, attributes: ['first_user_id', 'second_user_id']
    })

    if (existingRelation) {
      return res
        .status(409)
        .json({ msg: 'Relation already exists between these users' })
    }

    // insert the relation to the db
    const relation = await Relation.create(relationData)

    res.status(201).json(relation)
  } catch (err) {
    if (err.message.match(/^(invalid input syntax for integer)/)) {
      // this message will trigger iff non integer is put in req param
      return res.status(400).json({ msg: 'User not found' })
    }

    res.status(500).send('Server Error')
  }
})

// get all relations
router.get('/', auth, async (req, res) => {
  try {
    const relations = await Relation.findAll()

    res.status(200).send(relations)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// get friends list
router.get('/friends-list', auth, async (req, res) => {
  try {
    // populate friends list with friend id, name, and avatar
    const friendsList = await populateFriendsList(req.user.id)

    res.status(200).json(friendsList)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// accept friend request
router.patch('/accept/:friend_id', auth, async (req, res) => {
  try {
    // confirm friend to accept request from exists in db
    const friend = await User.findOne({
      where: { id: req.params.friend_id },
      attributes: ['id']
    })

    if (!friend) {
      return res.status(404).json({ msg: 'User not found' })
    }

    // format relation to pass db schema validation
    // if requestor has the higher id; swap user positions and change relation type
    const relationData = formatPendingRelation(
      parseInt(req.params.friend_id), // requestor
      req.user.id, // accepter
      'pending_first_second' // relation type
    )

    // confirm pending friend requests relation exists between the two users
    let relation = await Relation.findOne({
      where: relationData,
      attributes: ['first_user_id', 'second_user_id']
    })

    if (!relation) {
      return res.status(404).json({ msg: 'Pending friend request not found' })
    }

    // update and insert the updated relation into the db
    relation = await relation.update({
      relationType: 'friends'
    })

    res.status(201).json(relation)
  } catch (err) {
    if (err.message.match(/^(invalid input syntax for integer)/)) {
      // this message will trigger iff non integer is put in req param
      return res.status(400).json({ msg: 'User not found' })
    }

    res.status(500).send('Server Error')
  }
})

// deny friend request or unfriend
router.delete('/:friend_id', auth, async (req, res) => {
  try {
    // confirm friend to remove relation to exists in db
    const friend = await User.findOne({
      where: { id: req.params.friend_id },
      attributes: ['id']
    })

    if (!friend) {
      return res.status(404).json({ msg: 'User not found' })
    }

    // query db for existing relation between the two users
    const relation = await getRelation(req.user.id, req.params.friend_id)

    if (!relation) {
      return res.status(404).json({ msg: 'Relation between users not found' })
    }

    // delete the pending friend request relation from the db
    await relation.destroy()

    res.status(200).json({ msg: 'Relation deleted' })
  } catch (err) {
    if (err.message.match(/^(invalid input syntax for integer)/)) {
      // this message will trigger iff non integer is put in req param
      return res.status(400).json({ msg: 'User not found' })
    }

    res.status(500).send('Server Error')
  }
})

module.exports = router
