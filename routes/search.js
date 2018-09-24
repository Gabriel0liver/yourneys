const express = require('express')
const router = express.Router()
const Yourney = require('../models/yourney.js')

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }

  res.render('search')
})

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  const { location } = req.body

  Yourney.find({ location: location })
    .then((result) => {
      res.render('search-results')
    })
    .catch(next)
})

module.exports = router
