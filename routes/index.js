'use strict';

const express = require('express');
const router = express.Router();
const City = require('../models/city.js');

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
