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
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  User.findById(user._id)
    .then((result) => {
      const data = { user: result }

      res.render('profile-edit', data)
    })
    .catch(next)
})

router.post('/edit', (req, res, next) => {
  const user = req.session.currentUser
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  console.log(req.body)
  const { username, description } = req.body
  if (!username || !description) {
    req.flash('yourney-form-error', 'Please fill the fields')
    req.flash('yourney-form-data', { username, description })
    return res.redirect('/edit')
  }
  const update = { username, description }
  User.findByIdAndUpdate(user._id, update, { new: true })
    .then((result) => {
      req.session.currentUser = result
      res.redirect('/')
    })
    .catch(next)
})

module.exports = router
