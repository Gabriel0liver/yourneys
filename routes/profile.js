'use strict'

const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
// const ObjectId = require('mongoose').Types.ObjectId

router.get('/', (req, res, next) => {
  const user = req.session.currentUser
  console.log(user)
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  User.findById(user._id)
    .then((result) => {
      const data = { user: result }

      res.render('layout-profile', data)
    })
    .catch(next)
})

router.get('/edit', (req, res, next) => {
  const user = req.session.currentUser
  console.log(user)
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  User.findById(user._id)
    .then((result) => {
      const data = { user: result }

      res.render('layout-profile', data)
    })
    .catch(next)
})

module.exports = router
