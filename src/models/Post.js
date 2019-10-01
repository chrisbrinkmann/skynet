const Sequelize = require('sequelize')
const db = require('../database/database')

const Post = db.define('post', {
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT
  }
})

module.exports = Post
