const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const User = require('../models/User')
const Relation = require('../models/Relation')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { check } = require('express-validator')

// returns a JsonWebToken as a string
const createAuthToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })
}

// create a User model instance and insert into DB
const createUser = async (name, email, password, avatar) => {
  return User.create({
    name,
    email,
    password,
    avatar
  })
}

// returns array of express-validator checks
const registerValidatorChecks = () => {
  return [
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
  ]
}

// returns an array of express-validator checks
const loginValidatorChecks = () => {
  return [
    check('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
  ]
}

// returns an array of express-validator checks
const fieldValidatorChecks = field => {
  return [
    check(`${field}`, `${field} is required`)
      .not()
      .isEmpty()
  ]
}

// returns an array of express-validator checks
const emailValidatorChecks = () => {
  return [
    check('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail()
  ]
}

// returns an array of express-validator checks
const passwordValidatorChecks = () => {
  return [
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ]
}

// generate email hash and return link to gravatar image
const setAvatar = email => {
  return gravatar.url(
    email,
    {
      s: '200', // size
      r: 'r', // rating
      d: 'robohash' // default img, if none from email
    },
    true
  )
}

// returns a properly formatted object for insertion to relations table
const formatPendingRelation = (first_user_id, second_user_id, relationType) => {
  // cache variables; assume first_user_id has the lower id
  let relationData = {
    first_user_id,
    second_user_id,
    relationType
  }
  // if first_user_id has the higher id; swap user positions and relation type
  if (first_user_id > second_user_id) {
    relationData.first_user_id = second_user_id
    relationData.second_user_id = first_user_id
    relationData.relationType = 'pending_second_first'
  }

  return relationData
}

// return true if two users have a friends relation
const areFriends = async (first_user_id, second_user_id) => {
  // query db for relation
  const relation = await getRelation(first_user_id, second_user_id)

  // return false if there is no friends relation
  if (!relation || relation.relationType !== 'friends') return false

  return true
}

// query db for existing relation between to users; return the relation or null if none
const getRelation = async (first_user_id, second_user_id) => {
  // cache user id parameters
  let relationData = {
    first_user_id,
    second_user_id
  }

  // format relation so first_user_is is the lower of the two
  if (first_user_id > second_user_id) {
    relationData.first_user_id = second_user_id
    relationData.second_user_id = first_user_id
  }

  // query db for the relation
  const relation = await Relation.findOne({
    where: relationData
  })

  return relation
}

// return array of friends db relations
const getFriendRelations = async user_id => {
  // query db
  const friends = await Relation.findAll({
    where: {
      [Op.or]: [
        { first_user_id: { [Op.eq]: user_id } },
        { second_user_id: { [Op.eq]: user_id } }
      ],
      relationType: 'friends'
    }
  })

  return friends
}

// returns count of a users friends
const getFriendsCount = async user_id => {
  const friends = await getFriendRelations(user_id)

  return friends.length
}

// returns an array integer friend ids of user
const getFriendIds = async user_id => {
  const friendRelations = await getFriendRelations(user_id)
  let friend_ids = []

  // add friend ids to array cache
  friendRelations.map(relation => {
    if (relation.first_user_id !== user_id) {
      return friend_ids.push(relation.first_user_id)
    }
    if (relation.second_user_id !== user_id) {
      return friend_ids.push(relation.second_user_id)
    }
  })

  return friend_ids
}

// returns a formatted friends list array with friend id, name, avatar
const populateFriendsList = async user_id => {
  // cache friend ids
  let friend_ids = await getFriendIds(user_id)

  // create cache of friend objects
  let friendsList = []

  // forEach friend id, add the formatted friend
  await Promise.all(
    friend_ids.map(async friend_id => {
      friendsList.push(await getFormattedFriend(friend_id))
    })
  )

  return friendsList
}

// returns a formatted friend object for display in friend list
const getFormattedFriend = async friend_id => {
  const friend = await User.findOne({ where: { id: friend_id } })

  return {
    id: friend.id,
    name: friend.name,
    avatar: friend.avatar
  }
}

// returns array of formatted post objects owned by the param user
const populateUserPosts = async user_id => {
  // query db for all ids of posts by self
  const postIds = await Post.findAll({
    where: {
      user_id
    },
    order: [['id', 'DESC']],
    attributes: ['id'],
    limit: 100
  })

  // for each post get add the formatted post to the array
  const userPosts = Promise.all(
    postIds.map(async postId => {
      return await getFormattedPost(postId.id)
    })
  )

  return userPosts
}

// returns newsfeed array of formatted post objects
const populateNewsFeed = async user_id => {
  // cache friend ids, include self
  let friend_ids = await getFriendIds(user_id)
  friend_ids.push(user_id)

  // query db for all ids of posts by friends and self
  const friendPosts = await Post.findAll({
    where: {
      user_id: {
        [Op.in]: friend_ids
      }
    },
    order: [['id', 'DESC']],
    attributes: ['id'],
    limit: 100
  })

  // for each post get add the formatted post to the array
  const newsFeed = Promise.all(
    friendPosts.map(async post => {
      return await getFormattedPost(post.id)
    })
  )

  return newsFeed
}

// returns a formatted post object with comments array
const getFormattedPost = async post_id => {
  const post = await Post.findOne({
    where: { id: post_id },
    attributes: ['id', 'content', 'user_id']
  })
  const user = await User.findOne({
    where: { id: post.user_id },
    attributes: ['id', 'name', 'avatar']
  })

  return {
    id: post.id,
    user_id: user.id,
    user_name: user.name,
    user_avatar: user.avatar,
    content: post.content,
    comments: await getFormattedPostComments(post_id)
  }
}

// returns array of formatted comments for a post
const getFormattedPostComments = async postId => {
  // query db for all comments with post_id matching the param
  const comments = await Comment.findAll({
    where: { post_id: postId },
    order: [['id', 'ASC']],
    attributes: ['id'],
    limit: 100
  })

  // for each comment add the formatted comment to the array
  const postComments = Promise.all(
    comments.map(async comment => {
      return await getFormattedComment(comment.id)
    })
  )

  return postComments
}

// returns a formatted comment object
const getFormattedComment = async comment_id => {
  const comment = await Comment.findOne({
    where: { id: comment_id },
    attributes: ['id', 'user_id', 'content']
  })
  const user = await User.findOne({
    where: { id: comment.user_id },
    attributes: ['id', 'name', 'avatar']
  })

  return {
    id: comment.id,
    user_id: user.id,
    user_name: user.name,
    user_avatar: user.avatar,
    content: comment.content
  }
}

module.exports = {
  createAuthToken,
  createUser,
  registerValidatorChecks,
  loginValidatorChecks,
  fieldValidatorChecks,
  emailValidatorChecks,
  passwordValidatorChecks,
  setAvatar,
  formatPendingRelation,
  areFriends,
  getRelation,
  getFriendRelations,
  getFriendsCount,
  getFriendIds,
  populateFriendsList,
  populateNewsFeed,
  populateUserPosts
}
