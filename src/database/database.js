const Sequelize = require('sequelize')

// connect to db
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
)

// test db connection
db.authenticate()
  .then(() => console.log('Connected to database...'))
  .catch(err => console.log('Unable to connect to the database:', err))

module.exports = db