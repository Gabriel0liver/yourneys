const express = require('express')
const router = express.Router()
const Yourney = require('../models/yourney.js')

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }

  res.render('search')
})

router.get('/results', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  const { location, date, days } = req.query

  // check if you have location, date, days
  let matchQuery = {}
  if (location) {
    matchQuery.location = location
  }
  if (date) {
    matchQuery.date = date
  }
  if (days) {
    matchQuery.days = days
  }

  Yourney.find(matchQuery)
    .populate('owner')
    .then((results) => {
      const data = {
        yourneys: results
      }
      res.render('search-results', data)
    })
    .catch(next)
})

module.exports = router
