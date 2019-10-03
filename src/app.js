const express = require('express')
const app = express()

// midleware
app.use(express.json())

// api routes
app.use('/users', require('./routes/users'))
app.use('/relations', require('./routes/relations'))
app.use('/posts', require('./routes/posts'))
app.use('/comments', require('./routes/comments'))

module.exports = app
