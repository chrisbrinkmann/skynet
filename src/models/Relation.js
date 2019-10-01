const Sequelize = require('sequelize')
const db = require('../database/database')

const Relation = db.define(
  'relation',
  {
    first_user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      primaryKey: true,
      allowNull: false
    },
    second_user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      primaryKey: true,
      allowNull: false
    },
    relation: {
      type: Sequelize.STRING,
      defaultValue: 'none',
      validate: {
        isIn: [
          ['none', 'pending_first_second', 'pending_second_first', 'friends']
        ]
      }
    }
  },
  {
    validate: {
      isNotSelfRelation() {
        if (this.first_user_id === this.second_user_id) {
          throw new Error('Self relations not allowed')
        }
      },
      firstLessThanSecond() {
        // prevents duplicate relations
        if (this.first_user_id > this.second_user_id) {
          throw new Error('first_user_id must be less than second_user_id')
        }
      }
    }
  }
)

module.exports = Relation
