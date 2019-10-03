const db = require('../../src/database/database')
const User = require('../../src/models/User')

// sample user data
const userOne = {
  name: 'Joni Stubbs',
  email: 'jstubbs@example.com',
  password: '123456'
}

const syncDatabase = async () => {
  // for each model: drop table if exists, then create new table
  await db.sync({ force: true })
}

const populateTables = async () => {
  // delete all rows in table
  await User.destroy({ where: {} })

  // insert a sample user
  await User.create(userOne)
}

module.exports = {
  syncDatabase,
  populateTables
}
