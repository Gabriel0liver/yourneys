'use strict';

const express = require('express');
const router = express.Router();
const Yourney = require('../models/yourney.js');

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }

  res.render('search');
});

router.get('/results', (req, res, next) => {
  const user = req.session.currentUser;
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const { location, date, days } = req.query;

  // check if you have location, date, days
  let matchQuery = {};
  if (location) {
    matchQuery.location = location.toLowerCase();
  }
  if (date) {
    matchQuery.date = date;
  }
  if (days) {
    matchQuery.days = days;
  }

  Yourney.find(matchQuery)
    .populate('owner')
    .then((results) => {
      results.map((yourney) => {
        yourney.userAdded = false;
        if (yourney.addedBy) {
          const addedBy = yourney.addedBy.filter((item) => {
            return item._id.equals(user._id);
          });
          if (addedBy.length) yourney.userAdded = true;
        }

        if (yourney.favoritedBy) {
          const favoritedBy = yourney.favoritedBy.filter((item) => {
            return item._id.equals(user._id);
          });
          if (favoritedBy.length) yourney.userFavorite = true;
        }
        return yourney;
      });
      const data = {
        yourneys: results
      };
      res.render('search-results', data);
    })
    .catch(next);
});

module.exports = router;
