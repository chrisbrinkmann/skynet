const db = require('../../src/database/database')
const User = require('../../src/models/User')
const Post = require('../../src/models/Post')
const Comment = require('../../src/models/Comment')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// sample register user http req data
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
  }
]

// cache users returned from db insertions here
const dbUsers = []

// cache tokens from sample user logins here
const tokens = []

// sample create new post http req data
const samplePostData = [
  { content: 'First post!' },
  { content: 'I like pancakes.' },
  { content: 'What is life?' },
  { content: 'I like apples.' },
  { content: 'Your mom goes to college.' }
]

// cache posts returned from db insertions here
const dbPosts = []


const syncDatabase = async () => {
   // for each model: drop table if exists, then create new table
  await db.sync({ force: true })

  // clear cache of tokens
  tokens.length = 0

  await Promise.all(
    // loop thru sampleUserData
    sampleUserData.map(async user => {
      // cache the hashed passwords
      const hashedPassword = await bcrypt.hash(user.password, 8)

      // insert sample user to DB with the hashed passwords
      const inserted = await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword
      })

      // add instered users to cache array
      dbUsers.push(inserted.dataValues)

      // login sample user
      const token = jwt.sign(inserted.dataValues, process.env.JWT_SECRET)

      // add login token to cache array
      tokens.push(token)
    })
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
    user_id: dbUsers[1].id,
    content: samplePostData[3].content
  })
  const dbPostFive = await Post.create({
    user_id: dbUsers[2].id,
    content: samplePostData[4].content
  })

  // add inserted tasks to cache array
  dbPosts.push(
    dbPostOne.dataValues,
    dbPostTwo.dataValues,
    dbPostThree.dataValues,
    dbPostFour.dataValues,
    dbPostFive.dataValues
  )
}

module.exports = {
  syncDatabase,
  sampleUserData,
  dbUsers,
  samplePostData,
  dbPosts,
  tokens
}
