'use strict';

const MongoClient = require('mongodb').MongoClient,
  R = require('ramda');

module.exports = function collectionBrowseHandler(req, res, next) {
  let db, collection;

  MongoClient.connect('mongodb://collection-db/rune')
    .then(database => {
      db = database;
      collection = db.collection('collections');
    })
    .then(() => ensureDefaultCollection(collection, req.params.user))
    .then(() => getAllCollections(collection, req.params.user))
    .then(res.json.bind(res))
    .then(next)
    .catch(next)
    .then(() => db.close());
};

function ensureDefaultCollection(collection, username) {
  return collection.findOne({ user: username, slug: 'default' })
    .then(doc => {
      if (doc) return;
      return collection.insertOne({
        name: 'Default',
        slug: 'default',
        user: username,
        cards: [ ]
      });
    });
}

function getAllCollections(collection, username) {
  return collection.find(
    { user: username },
    { _id: 0 }
  ).toArray();
}
