const Sequelize = require('sequelize')

let useSSL = true

// set use SSL to false if NODE_ENV is development or test
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  useSSL = false
}

// connect to db
const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: useSSL
  }
})

// test db connection
db.authenticate()
  .then(() => console.log('Connected to database...'))
  .catch(err => console.log('Unable to connect to the database:', err))

module.exports = db
