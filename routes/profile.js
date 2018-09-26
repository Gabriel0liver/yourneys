'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const uploadCloud = require('../services/cloudinary.js');
// const mongoose = require('mongoose');

const Yourney = require('../models/yourney');

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const user = req.session.currentUser;
  // const id = req.params.id;
  // var otherUser = mongoose.Types.ObjectId(id);
  // var currentUser = mongoose.Types.ObjectId(user._id);
  // if (otherUser.equals(currentUser)) {
  //   user.isMyProfile = true;
  // }

  const promiseUser = User.findById(user._id);
  const promiseUpcomingYourneys = Yourney.find({ addedBy: user._id });
  const promiseCreatedYourneys = Yourney.find({ owner: user._id });

  Promise.all([promiseUser, promiseUpcomingYourneys, promiseCreatedYourneys])
    .then((results) => {
      const data = {
        user: results[0],
        upcomingYourneys: results[1],
        createdYourneys: results[2]
      };
      res.render('layout-profile', data);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const id = req.params.id;
  // var otherUser = mongoose.Types.ObjectId(id);
  // var currentUser = mongoose.Types.ObjectId(user._id);
  // if (otherUser.equals(currentUser)) {
  //   user.isMyProfile = true;
  // }

  const promiseUser = User.findById(id);
  const promiseUpcomingYourneys = Yourney.find({ addedBy: id });
  const promiseCreatedYourneys = Yourney.find({ owner: id });

  Promise.all([promiseUser, promiseUpcomingYourneys, promiseCreatedYourneys])
    .then((results) => {
      const data = {
        user: results[0],
        upcomingYourneys: results[1],
        createdYourneys: results[2]
      };
      res.render('other-user', data);
    })
    .catch(next);
});

router.get('/edit', (req, res, next) => {
  const user = req.session.currentUser;
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  User.findById(user._id)
    .then((result) => {
      const data = { user: result };

      res.render('profile-edit', data);
    })
    .catch(next);
});

router.post('/edit', uploadCloud.single('profilepic'), (req, res, next) => {
  const user = req.session.currentUser;
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const { username, description } = req.body;
  const profilepic = req.file.url;
  if (!username || !description) {
    req.flash('yourney-form-error', 'Please fill the fields');
    req.flash('yourney-form-data', { username, description });
    return res.redirect('/profile/edit');
  }
  const update = { username, description, profilepic };
  User.findByIdAndUpdate(user._id, update, { new: true })
    .then((result) => {
      req.session.currentUser = result;
      res.redirect('/profile');
    })
    .catch(next);
});

router.get('/favorite', (req, res, next) => {
  const user = req.session.currentUser;
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  Yourney.findById(user._id)
    .then((userData) => {
      Yourney.find({ favoritedBy: user._id })
        .populate('favoritedBy')
        .then((yourneysData) => {
          const data = {
            user: userData,
            yourneys: yourneysData
          };
          res.render('favorite', data);
        });
    })
    .catch(next);
});

// other users profileeee

// router.get('/:id', (req, res, next) => {
//   const id = req.params.id;
//   if (!req.session.currentUser) {
//     return res.redirect('/auth/login');
//   }
//   User.findById(id)
//     .then((userData) => {
//       const data = { user: userData };
//       res.render('other-profile', data);
//     })
//     .catch(next);
// });
// router.get('/profile', (req, res, next) => {
//   const id = req.params.id
//   const user = req.session.currentUser._id
//   const yourney = req.yourney.id
//   Yourney.findById(id, { $filter: { input: [yourney], as: addedBy(user.id) } })
//     .then((result) => {
//       console.log(result)
//       const data = {
//         yourney: result
//       }
//       res.render('layout-profile', data)
//     })
//     .catch(next)
// })

module.exports = router;
