const express = require('express');
const router = express.Router();
const Yourney = require('../models/yourney.js');
const City = require('../models/city.js');

router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
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
      yourneys.map((yourney) => {
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
