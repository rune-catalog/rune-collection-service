'use strict';

const restify   = require('restify'),
  ensureDefault = require('../lib/ensure-default'),
  Collection    = require('../model/collection');

module.exports = function collectionGetHandler(req, res, next) {
  ensureDefault.ensureDefaultCollection(req.params.user)
    .then(() => {
      let query = { user: req.params.user, slug: req.params.collection };
      Collection.findOne(query)
        .then(doc => {
          if (!doc) return next(new restify.NotFoundError())
          res.json(doc);
          next();
        });
    })
    .catch(err => next(err));
};
