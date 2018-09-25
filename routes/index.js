'use strict';

const express = require('express');
const router = express.Router();
const City = require('../models/city.js');
// const Yourney = require('../models/yourney.js');
// const ObjectId = require('mongoose').Types.ObjectId

// router.get('/', (req, res, next) => {
//   let query = {};
//   if (!req.session.currentUser) {
//     return res.redirect('/auth/login');
//   } else {
//     query = { owner: { $nin: [req.session.currentUser._id] } };
//   }

//   Yourney.find(query)
//     .populate('owner')
//     .then((result) => {
//       const data = { yourneys: result };

//       res.render('index', data);
//     })
//     .catch(next);
// });

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }

  City.find()
    .then((result) => {
      const data = { cities: result };

      res.render('index', data);
    })
    .catch(next);
});
module.exports = router;
