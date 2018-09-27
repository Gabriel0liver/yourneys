'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const uploadCloud = require('../services/cloudinary.js');

const Yourney = require('../models/yourney');

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const user = req.session.currentUser;

  const promiseUser = User.findById(user._id);
  const promiseUpcomingYourneys = Yourney.find({ addedBy: user._id }).populate('owner');
  const promiseCreatedYourneys = Yourney.find({ owner: user._id }).populate('owner');
  const promiseDoneYourneys = Yourney.find({ doneBy: user._id }).populate('owner');

  Promise.all([promiseUser, promiseUpcomingYourneys, promiseCreatedYourneys, promiseDoneYourneys])
    .then((results) => {
      const upcomingYourneys = results[1];
      upcomingYourneys.map((yourney) => {
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

        if (yourney.doneBy) {
          const doneBy = yourney.doneBy.filter((item) => {
            return item._id.equals(user._id);
          });
          if (doneBy.length) yourney.userDone = true;
        }

        if (yourney.owner) {
          if (yourney.owner.id === user._id) yourney.userOwner = true;
        }

        return yourney;
      });
      const createdYourneys = results[2];
      createdYourneys.map((yourney) => {
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
      const doneYourneys = results[3];
      doneYourneys.map((yourney) => {
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
        user: results[0],
        upcomingYourneys,
        createdYourneys,
        doneYourneys
      };
      res.render('layout-profile', data);
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

  let profilepic = user.profilepic;
  if (req.file) {
    profilepic = req.file.url;
  }

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
        .populate('owner')
        .then((yourneysData) => {
          yourneysData.map((yourney) => {
            yourney.userAdded = false;
            if (yourney.addedBy) {
              const addedBy = yourney.addedBy.filter((item) => {
                return item._id.equals(user._id);
              });
              if (addedBy.length) yourney.userAdded = true;
            }

            yourney.userFavorite = true;
            return yourney;
          });

          const data = {
            user: userData,
            yourneys: yourneysData
          };
          res.render('favorite', data);
        });
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const id = req.params.id;

  const promiseUser = User.findById(id);
  const promiseUpcomingYourneys = Yourney.find({ addedBy: id });
  const promiseCreatedYourneys = Yourney.find({ owner: id });
  const promiseDoneYourneys = Yourney.find({ doneBy: id });

  Promise.all([promiseUser, promiseUpcomingYourneys, promiseCreatedYourneys, promiseDoneYourneys])
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

module.exports = router;
