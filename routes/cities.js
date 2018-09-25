const express = require('express');
const router = express.Router();
const Yourney = require('../models/yourney.js');
const City = require('../models/city.js');

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const { location, img } = req.query;

  // check if you have location, date, days
  let matchQuery = {};
  if (location) {
    matchQuery.location = location.toLowerCase();
  }
  if (img) {
    matchQuery.img = img;
  }

  const promiseYourney = Yourney.find(matchQuery).populate('owner');
  const promiseCity = City.findOne({ location });

  Promise.all([promiseYourney, promiseCity])
    .then(results => {
      const yourneys = results[0];
      const city = results[1];
      const data = {
        yourneys,
        city
      };
      res.render('city', data);
    })
    .catch(next);
});

module.exports = router;
