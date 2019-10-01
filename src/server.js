const express = require('express')
const app = express()
const db = require('./database/database')
const port = process.env.PORT || 3000

// sync defined models to the DB tables
// for each model: drop table if exists, then create new table
db.sync({ force: true })
  .then(console.log('Defined models synced to DB'))
  .catch(err => console.log('Unable to sync:', err))

// middleware
app.use(express.json())

// api routes
app.use('/users', require('./routes/users'))
app.use('/relations', require('./routes/relations'))
app.use('/posts', require('./routes/posts'))
app.use('/comments', require('./routes/comments'))

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})