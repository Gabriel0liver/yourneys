'use strict'
'use strict'

const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
// const ObjectId = require('mongoose').Types.ObjectId

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  User.find({})
    .then((result) => {
      const data = { profile: result }

      res.render('layout-profile', data)
    })
    .catch(next)
})

module.exports = router
