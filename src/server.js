const express = require('express')
const app = express()
const db = require('./database/database')
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello world from server.')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})