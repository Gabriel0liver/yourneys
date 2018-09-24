'use strict'

const express = require('express')
const router = express.Router()

const User = require('../models/user')

router.get('/students', (req, res, next) => {
  User.find({})
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      console.error('ERROR', req.method, req.path, err)
      res.status(500).json({ message: 'error-unexpected' })
    })
})

router.get('/username-unique', (req, res, next) => {
  const username = req.query.username
  User.findOne({ username })
    .then((result) => {
      res.json({ unique: !result })
    })
    .catch((err) => {
      console.error('ERROR', req.method, req.path, err)
      res.status(500).json({ message: 'error-unexpected' })
    })
})

module.exports = router
