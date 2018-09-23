'use strict'

const express = require('express')
const router = express.Router()
const Yourney = require('../models/yourney.js')
// const ObjectId = require('mongoose').Types.ObjectId

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  Yourney.find({})
    .then((result) => {
      const data = { yourneys: result }

      res.render('index', data)
    })
    .catch(next)
})

router.get('/create', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  const formData = req.flash('yourney-form-data')
  const formErrors = req.flash('yourney-form-error')
  const data = {
    message: formErrors[0],
    fields: formData[0]
  }
  res.render('yourney-create', data)
})

router.post('/create', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  const { date, name, snippet, description, location, days } = req.body
  if (!days || !name || !snippet || !description || !location) {
    req.flash('yourney-form-error', 'Mandatory fields!')
    req.flash('yourney-form-data', { date, name, snippet, description, location, days })
    return res.redirect('/create')
  }

  const yourney = new Yourney({ date, name, snippet, description, location, days })
  yourney.save()
    .then(() => {
      res.redirect('/yourney/:id')
    })
    .catch(next)
})

router.get('/yourney/:id', (req, res, next) => {
  const id = req.params.yourneyId
  console.log(id)
  Yourney.findById(id)
    .then((result) => {
      const data = {
        yourney: result
      }
      res.render('yourney-details', data)
    })
    .catch(next)
})

module.exports = router
