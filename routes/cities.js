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

  Yourney.find(matchQuery)
    .populate('owner')
    .then((yourneyresult) => {
      City.findOne({ location })
        .then((cityresult) => {
          const data = {
            yourneys: yourneyresult,
            location,
            img: cityresult.img
          };
          res.render('city', data);
        });
    })
    .catch(next);
});

module.exports = router;
