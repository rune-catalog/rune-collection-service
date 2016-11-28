'use strict';

const mongoose = require('mongoose'),
  Collection   = require('../model/collection'),
  restify      = require('restify'),
  slug         = require('slug');

module.exports = function collectionPostHandler(req, res, next) {
  let name = req.body.name,
    user = req.params.user;

  rejectIfExists(name)
    .then(() => generateSlug(name))
    .then(slug => createCollection(name, slug, user))
    .then(c => {
      res.json(c);
      next();
    })
    .catch(err => next(err));
};

function rejectIfExists(name) {
  return Collection.findOne({ name: name })
    .then(doc => {
      if (doc) throw new restify.ConflictError();
    });
}

function generateSlug(name) {
  let collectionSlug = slug(name, { lower: true });
  let re = new RegExp(`^${collectionSlug}`);

  return Collection.count({ slug: re })
    .then(count => {
      if (count === 0) return collectionSlug;
      return `${collectionSlug}-${count}`;
    });
}

function createCollection(name, slug, user) {
  let collection = new Collection({ name, slug, user });
  return collection.save();
}
