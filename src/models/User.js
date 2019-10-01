const Sequelize = require('sequelize')
const db = require('../database/database')

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  avatar: {
    type: Sequelize.STRING
  },
  bio: {
    type: Sequelize.TEXT
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = User