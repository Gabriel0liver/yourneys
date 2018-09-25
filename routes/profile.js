'use strict'

const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const uploadCloud = require('../services/cloudinary.js')

const Yourney = require('../models/yourney')
// const ObjectId = require('mongoose').Types.ObjectId

router.get('/', (req, res, next) => {
  const user = req.session.currentUser
  console.log(user)
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  User.findById(user._id)
    .then((userData) => {
      Yourney.find({ addedBy: user._id })
        .then((yourneysData) => {
          const data = {
            user: userData,
            yourneys: yourneysData
          }
          res.render('layout-profile', data)
        })
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

router.post('/edit', uploadCloud.single('profilepic'), (req, res, next) => {
  const user = req.session.currentUser
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  const { username, description } = req.body
  const profilepic = req.file.url
  if (!username || !description) {
    req.flash('yourney-form-error', 'Please fill the fields')
    req.flash('yourney-form-data', { username, description })
    return res.redirect('/profile/edit')
  }
  const update = { username, description, profilepic }
  User.findByIdAndUpdate(user._id, update, { new: true })
    .then((result) => {
      req.session.currentUser = result
      res.redirect('/profile')
    })
    .catch(next)
})

// router.get('/profile', (req, res, next) => {
//   const id = req.params.id
//   const user = req.session.currentUser._id
//   const yourney = req.yourney.id
//   Yourney.findById(id, { $filter: { input: [yourney], as: addedBy(user.id) } })
//     .then((result) => {
//       console.log(result)
//       const data = {
//         yourney: result
//       }
//       res.render('layout-profile', data)
//     })
//     .catch(next)
// })

module.exports = router
