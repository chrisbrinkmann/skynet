const db = require('../../src/database/database')
const User = require('../../src/models/User')
const Post = require('../../src/models/Post')
const Comment = require('../../src/models/Comment')
const Relation = require('../../src/models/Relation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// sample register user http req body data
const sampleUserData = [
  {
    name: 'Chris',
    email: 'chris@example.com',
    password: '123456'
  },
  {
    name: 'Min',
    email: 'min@example.com',
    password: '123456'
  },
  {
    name: 'Peter',
    email: 'peter@example.com',
    password: '123456'
  },
  {
    name: 'John',
    email: 'john@example.com',
    password: '123456'
  },
  {
    name: 'Sarah',
    email: 'sarah@example.com',
    password: '123456'
  }
]

// sample create new post http req body data
const samplePostData = [
  { content: 'First post!' },
  { content: 'I like pancakes.' },
  { content: 'What is life?' },
  { content: 'I like apples.' },
  { content: 'Your mom goes to college.' },
  { content: 'Whats up everybody?' }
]

// sample create new comment http req body data
const sampleCommentData = [
  { content: 'Nice!' },
  { content: 'Way to go!' },
  { content: 'Waffles are better.' },
  { content: 'No french toast is best.' },
  { content: "I'm in ketosis." }
]

// caches for returns from db insertions and logins
const dbUsers = []
const tokens = []
const dbPosts = []
const dbComments = []
const dbRelations = []

const syncDatabase = async () => {
  // for each model: drop table if exists, then create new table
  await db.sync({ force: true })

  // clear caches
  dbUsers.length = 0
  tokens.length = 0
  dbPosts.length = 0
  dbComments.length = 0
  dbRelations.length = 0

  // cache sample user hashed passwords
  const dbUserOneHashedPassword = await bcrypt.hash(
    sampleUserData[0].password,
    8
  )
  const dbUserTwoHashedPassword = await bcrypt.hash(
    sampleUserData[1].password,
    8
  )
  const dbUserThreeHashedPassword = await bcrypt.hash(
    sampleUserData[2].password,
    8
  )
  const dbUserFourHashedPassword = await bcrypt.hash(
    sampleUserData[3].password,
    8
  )
  const dbUserFiveHashedPassword = await bcrypt.hash(
    sampleUserData[4].password,
    8
  )

  // insert sample users into db with hashed passwords
  const dbUserOne = await User.create({
    name: sampleUserData[0].name,
    email: sampleUserData[0].email,
    password: dbUserOneHashedPassword
  })
  const dbUserTwo = await User.create({
    name: sampleUserData[1].name,
    email: sampleUserData[1].email,
    password: dbUserTwoHashedPassword
  })
  const dbUserThree = await User.create({
    name: sampleUserData[2].name,
    email: sampleUserData[2].email,
    password: dbUserThreeHashedPassword
  })
  const dbUserFour = await User.create({
    name: sampleUserData[3].name,
    email: sampleUserData[3].email,
    password: dbUserFourHashedPassword
  })
  const dbUserFive = await User.create({
    name: sampleUserData[4].name,
    email: sampleUserData[4].email,
    password: dbUserFiveHashedPassword
  })

  // login sample users (create auth tokens)
  const dbUserOneToken = jwt.sign({ id: dbUserOne.id }, process.env.JWT_SECRET)
  const dbUserTwoToken = jwt.sign({ id: dbUserTwo.id }, process.env.JWT_SECRET)
  const dbUserThreeToken = jwt.sign(
    { id: dbUserThree.id },
    process.env.JWT_SECRET
  )
  const dbUserFourToken = jwt.sign(
    { id: dbUserFour.id },
    process.env.JWT_SECRET
  )
  const dbUserFiveToken = jwt.sign(
    { id: dbUserFive.id },
    process.env.JWT_SECRET
  )

  // add inserted users and tokens to cache
  dbUsers.push(
    dbUserOne.dataValues,
    dbUserTwo.dataValues,
    dbUserThree.dataValues,
    dbUserFour.dataValues,
    dbUserFive.dataValues
  )
  tokens.push(
    dbUserOneToken,
    dbUserTwoToken,
    dbUserThreeToken,
    dbUserFourToken,
    dbUserFiveToken
  )

  // insert sample posts into db
  const dbPostOne = await Post.create({
    user_id: dbUsers[0].id,
    content: samplePostData[0].content
  })
  const dbPostTwo = await Post.create({
    user_id: dbUsers[1].id,
    content: samplePostData[1].content
  })
  const dbPostThree = await Post.create({
    user_id: dbUsers[2].id,
    content: samplePostData[2].content
  })
  const dbPostFour = await Post.create({
    user_id: dbUsers[3].id,
    content: samplePostData[3].content
  })
  const dbPostFive = await Post.create({
    user_id: dbUsers[4].id,
    content: samplePostData[4].content
  })
  const dbPostSix = await Post.create({
    user_id: dbUsers[4].id,
    content: samplePostData[5].content
  })

  // add inserted posts to cache array
  dbPosts.push(
    dbPostOne.dataValues,
    dbPostTwo.dataValues,
    dbPostThree.dataValues,
    dbPostFour.dataValues,
    dbPostFive.dataValues,
    dbPostSix.dataValues
  )

  // insert sample relations into db
  const dbRelationOne = await Relation.create({
    first_user_id: dbUsers[0].id,
    second_user_id: dbUsers[1].id,
    relationType: 'pending_first_second'
  })
  const dbRelationTwo = await Relation.create({
    first_user_id: dbUsers[0].id,
    second_user_id: dbUsers[2].id,
    relationType: 'pending_second_first'
  })
  const dbRelationThree = await Relation.create({
    first_user_id: dbUsers[0].id,
    second_user_id: dbUsers[3].id,
    relationType: 'friends'
  })
  const dbRelationFour = await Relation.create({
    first_user_id: dbUsers[0].id,
    second_user_id: dbUsers[4].id,
    relationType: 'friends'
  })
  const dbRelationFive = await Relation.create({
    first_user_id: dbUsers[1].id,
    second_user_id: dbUsers[3].id,
    relationType: 'friends'
  })
  const dbRelationSix = await Relation.create({
    first_user_id: dbUsers[1].id,
    second_user_id: dbUsers[4].id,
    relationType: 'friends'
  })
  const dbRelationSeven = await Relation.create({
    first_user_id: dbUsers[2].id,
    second_user_id: dbUsers[3].id,
    relationType: 'friends'
  })
  const dbRelationEight = await Relation.create({
    first_user_id: dbUsers[2].id,
    second_user_id: dbUsers[4].id,
    relationType: 'friends'
  })

  // add inserted relations to cache array
  dbRelations.push(
    dbRelationOne.dataValues,
    dbRelationTwo.dataValues,
    dbRelationThree.dataValues,
    dbRelationFour.dataValues,
    dbRelationFive.dataValues,
    dbRelationSix.dataValues,
    dbRelationSeven.dataValues,
    dbRelationEight.dataValues
  )

  // insert sample comments into db
  const dbCommentOne = await Comment.create({
    user_id: dbUsers[3].id,
    post_id: dbPosts[0].id,
    content: sampleCommentData[0].content
  })
  const dbCommentTwo = await Comment.create({
    user_id: dbUsers[4].id,
    post_id: dbPosts[0].id,
    content: sampleCommentData[1].content
  })
  const dbCommentThree = await Comment.create({
    user_id: dbUsers[3].id,
    post_id: dbPosts[1].id,
    content: sampleCommentData[2].content
  })
  const dbCommentFour = await Comment.create({
    user_id: dbUsers[4].id,
    post_id: dbPosts[1].id,
    content: sampleCommentData[3].content
  })
  const dbCommentFive = await Comment.create({
    user_id: dbUsers[3].id,
    post_id: dbPosts[2].id,
    content: sampleCommentData[4].content
  })

  dbComments.push(
    dbCommentOne.dataValues,
    dbCommentTwo.dataValues,
    dbCommentThree.dataValues,
    dbCommentFour.dataValues,
    dbCommentFive.dataValues
  )
}

module.exports = {
  syncDatabase,
  sampleUserData,
  samplePostData,
  sampleCommentData,
  dbUsers,
  dbPosts,
  dbRelations,
  dbComments,
  tokens
}
