'use strict';

const express = require('express');
const router = express.Router();
const Yourney = require('../models/yourney.js');
// const ObjectId = require('mongoose').Types.ObjectId

router.get('/create', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const formData = req.flash('yourney-form-data');
  const formErrors = req.flash('yourney-form-error');
  const data = {
    message: formErrors[0],
    fields: formData[0]
  };
  res.render('yourney-create', data);
});

router.post('/create', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  console.log(req.body);
  const owner = req.session.currentUser._id;
  let { date, name, snippet, description, location, days } = req.body;
  if (!days || !name || !snippet || !description || !location) {
    req.flash('yourney-form-error', 'Mandatory fields!');
    req.flash('yourney-form-data', { date, name, snippet, description, location, days });
    return res.redirect('/yourney/create');
  }

  // normalize data
  location = location.toLowerCase();
  const yourney = new Yourney({ date, name, snippet, description, location, days, owner });
  yourney.save()
    .then(() => {
      res.redirect(`/yourney/${yourney.id}`);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Yourney.findById(id)
    .populate('owner')
    .then((result) => {
      const data = {
        yourney: result
      };
      res.render('yourney-details', data);
    })
    .catch(next);
});

router.post('/:id/add', (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.currentUser._id;
  Yourney.findByIdAndUpdate(id, { $push: { addedBy: userId } })
    .then((result) => {
      console.log(result);
      res.redirect(`/yourney/${id}`);
    })
    .catch(next);
});

router.post('/:id/remove', (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.currentUser._id;

  for (let a = 0; a < this.yourney.addedBy.length; a++) {
    if (this.yourney.addedBy[a] !== userId) {
      Yourney.findByIdAndUpdate(id, { $pull: { addedBy: userId } })
        .then((result) => {
          console.log(result);
          res.redirect(`/yourney/${id}`);
        })
        .catch(next);
    }
  }
});

module.exports = router;
