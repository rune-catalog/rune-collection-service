'use strict';

const Collection = require('../model/collection');

module.exports = function collectionBrowseHandler(req, res, next) {
  ensureDefaultCollection(req.params.user)
    .then(() => Collection.find({ user: req.params.user }))
    .then(docs => {
      res.json(docs);
      next();
    })
    .catch(err => next(err));
};

function ensureDefaultCollection(user) {
  let query = { user: user, slug: 'default' };
  return Collection.findOne(query)
    .then(doc => doc || createDefaultCollection(user));
}

function createDefaultCollection(user) {
  return Collection.create([
    {
      name: 'Default',
      slug: 'default',
      user,
      cards: [ ]
    }
  ]);
}
