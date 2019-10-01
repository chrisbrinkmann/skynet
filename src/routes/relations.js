const express = require('express')
const router = express.Router()
const Relation = require('../models/Relation')

// get all relations
router.get('/', async (req, res) => {
  try {
    const relations = await Relation.findAll()

    res.status(200).send(relations)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
