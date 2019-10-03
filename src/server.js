const app = require('./app')
const db = require('./database/database')
const port = process.env.PORT || 3000

// sync defined models to the DB tables
// for each model: drop table if exists, then create new table
db.sync({ force: true })
  .then(console.log('Defined models synced to DB'))
  .catch(err => console.log('Unable to sync:', err))

app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV}, listening on port ${port}`)
})