const db = require('../../src/database/database')
const User = require('../../src/models/User')
const bcrypt = require('bcryptjs')

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

const syncDatabase = async () => {
  // for each model: drop table if exists, then create new table
  await db.sync({ force: true })
}

const populateTables = async () => {
  // delete all rows in table
  await User.destroy({ where: {} })

  await Promise.all(
    // loop thru sampleUsers
    sampleUsers.map(async user => {
      // cache the hashed passwords
      const hashedPassword = await bcrypt.hash(user.password, 8)

      // insert sample users to DB with the hashed passwords
      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword
      })
    })
  )
}

module.exports = {
  syncDatabase,
  populateTables,
  sampleUsers
}
