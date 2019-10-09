const Sequelize = require('sequelize')
const db = require('../database/database')

const Comment = db.define('comment', {
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  },
  post_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'posts',
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Comment
