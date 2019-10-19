const express = require('express')
const app = express()
const cors = require('cors');
const path = require('path')

// midleware
app.use(express.json())
app.use(cors());

// api routes
app.use('/users', require('./routes/users'))
app.use('/relations', require('./routes/relations'))
app.use('/posts', require('./routes/posts'))
app.use('/comments', require('./routes/comments'))

// serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'))

  // serve the built index.js
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

module.exports = app
