'use strict';

const MongoClient = require('mongodb').MongoClient,
  R = require('ramda');

module.exports = function collectionBrowseHandler(req, res, next) {
  let db;

  MongoClient.connect('mongodb://collection-db/rune')
    .then(database => {
      db = database;
      return db.collection('collections').find(
        { user: req.params.user },
        { _id: 0 }).toArray();
    })
    .then(docs => {
      docs = ensureDefaultCollection(docs, req.params.user);
      res.json(docs);
      next();
    })
    .catch(next)
    .then(() => db.close());
};

function ensureDefaultCollection(collections, username) {
  if (R.any(collection => collection.name === 'default', collections)) {
    return collections;
  }

  return collections.concat([{
    name: 'Default',
    slug: 'default',
    user: username,
    cards: [ ]
  }]);
}
