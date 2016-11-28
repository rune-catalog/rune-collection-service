'use strict';

const Collection = require('../model/collection'),
  ensureDefault = require('../lib/ensure-default');

module.exports = function collectionBrowseHandler(req, res, next) {
  ensureDefault.ensureDefaultCollection(req.params.user)
    .then(() => Collection.find({ user: req.params.user }))
    .then(docs => {
      res.json(docs);
      next();
    })
    .catch(err => next(err));
};
