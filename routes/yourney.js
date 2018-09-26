'use strict';

const express = require('express');
const router = express.Router();
const Yourney = require('../models/yourney.js');
const ObjectId = require('mongoose').Types.ObjectId;
const uploadCloud = require('../services/cloudinary.js');

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

router.post('/create', uploadCloud.single('img'), (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const owner = req.session.currentUser._id;
  let { name, snippet, description, location, days } = req.body;
  const img = req.file.url;
  if (!days || !name || !snippet || !description || !location) {
    req.flash('yourney-form-error', 'Mandatory fields!');
    req.flash('yourney-form-data', { name, snippet, description, location, days, img });
    return res.redirect('/yourney/create');
  }

  // normalize data
  location = location.toLowerCase();
  const yourney = new Yourney({ name, snippet, description, location, days, owner, img });
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

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  Yourney.findById(id)
    .then((result) => {
      const data = { yourney: result };

      res.render('yourney-edit', data);
    })
    .catch(next);
});

router.post('/:id/edit', uploadCloud.single('img'), (req, res, next) => {
  const id = req.params.id;
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }

  let { name, snippet, description, location, days } = req.body;
  // const img = req.file.url;
  if (!days || !name || !snippet || !description || !location) {
    req.flash('yourney-form-error', 'Mandatory fields!');
    req.flash('yourney-form-data', { name, snippet, description, location, days });
    return res.redirect(`/yourney/${id}/edit`);
  }

  const update = { name, snippet, description, location, days, img };
  location = location.toLowerCase();
  Yourney.findByIdAndUpdate(id, update, { new: true })
    .then((result) => {
      res.redirect(`/yourney/${id}`);
    })
    .catch(next);
});

router.post('/:id/add', (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.currentUser._id;
  Yourney.findByIdAndUpdate(id, { $push: { addedBy: userId } }, { new: true })
    .then((result) => {
      console.log(result);
      res.redirect(`/yourney/${id}`);
    })
    .catch(next);
});

router.post('/:id/remove', (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.currentUser._id;

  Yourney.findByIdAndUpdate(id, { $pull: { addedBy: userId } }, { new: true })
    .then((result) => {
      console.log(result);
      res.redirect(`/profile`);
    })
    .catch(next);
});

router.post('/:id/done', (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.currentUser._id;
  const promisePull = Yourney.findByIdAndUpdate(id, { $pull: { addedBy: userId } }, { new: true });
  const promisePush = Yourney.findByIdAndUpdate(id, { $push: { doneBy: userId } }, { new: true });

  Promise.all([promisePush, promisePull])
    .then((results) => {
      res.redirect(`/profile`);
    })
    .catch(next);
});

router.post('/:id/fav', (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.currentUser._id;

  Yourney.findByIdAndUpdate(id, { $push: { favoritedBy: userId } }, { new: true })
    .then((result) => {
      console.log(result);
      res.redirect(`/profile/favorite`);
    })
    .catch(next);
});

router.post('/:id/removefav', (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.currentUser._id;

  Yourney.findByIdAndUpdate(id, { $pull: { favoritedBy: userId } }, { new: true })
    .then((result) => {
      console.log(result);
      res.redirect(`/profile/favorite`);
    })
    .catch(next);
});

router.post('/:id/delete', (req, res, next) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.redirect('/profile');
  }

  Yourney.remove({ _id: id })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(next);
});

module.exports = router;
