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
  const { date, name, snippet, description, location, days } = req.body;
  if (!days || !name || !snippet || !description || !location) {
    req.flash('yourney-form-error', 'Mandatory fields!');
    req.flash('yourney-form-data', { date, name, snippet, description, location, days });
    return res.redirect('/yourney/create');
  }

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
      res.redirect(`/yourney/${id}`);
    })
    .catch(next);
});

module.exports = router;
