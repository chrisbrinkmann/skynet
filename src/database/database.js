const Sequelize = require('sequelize')

let useSSL = false

// set use SSL to true if in production
if (process.env.NODE_ENV === 'production') {
  useSSL = true
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
