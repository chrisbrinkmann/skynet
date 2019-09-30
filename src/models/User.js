const Sequelize = require('sequelize')
const db = require('../database/database')

const User = db.define('user', {
  name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  email: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true
  },
  avatar: {
    type: Sequelize.TEXT
  },
  bio: {
    type: Sequelize.TEXT
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = User