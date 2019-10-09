const db = require('../../src/database/database')
const app = require('../../src/app')
const User = require('../../src/models/User')
const Post = require('../../src/models/Post')
const bcrypt = require('bcryptjs')
const request = require('supertest')

// sample user data
const sampleUsers = [
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

// cache tokens from sample user logins here
const tokens = []

const syncDatabase = async () => {
  // for each model: drop table if exists, then create new table
  await db.sync({ force: true })
}

const populateTables = async () => {
  // delete all rows in tables
  await User.destroy({ where: {} })
  await Post.destroy({ where: {}})

  // clear cache of tokens
  tokens.length = 0

  await Promise.all(
    // loop thru sampleUsers
    sampleUsers.map(async user => {
      // cache the hashed passwords
      const hashedPassword = await bcrypt.hash(user.password, 8)

      // insert sample user to DB with the hashed passwords
      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword
      })

      // login sample user
      const loginResponse = await request(app)
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password
        })

      const token = loginResponse.body.token

      // add login token to array
      tokens.push(token)
    })
  )
}

module.exports = {
  syncDatabase,
  populateTables,
  sampleUsers,
  tokens
}
