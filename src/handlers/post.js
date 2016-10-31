'use strict';

const MongoClient = require('mongodb').MongoClient,
  slug = require('slug');

module.exports = function collectionPostHandler(req, res, next) {
  let db;
  let collectionSlug = slug(req.body.name, { lower: true });
  let model = {
    name: req.body.name,
    user: req.params.user,
    slug: collectionSlug,
    cards: [ ]
  };

  res.json(model);

  MongoClient.connect('mongodb://collection-db/rune')
    .then(database => {
      db = database
      return db.collection('collections').insertOne(model);
    })
    .then(() => next())
    .catch(next)
    .then(() => db.close());
};
