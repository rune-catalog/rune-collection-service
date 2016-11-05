'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports = function collectionGetHandler(req, res, next) {
  let db;

  MongoClient.connect('mongodb://collection-db/rune')
    .then(database => {
      db = database;
      return db.collection('collections').findOne(
        { slug: req.params.collection },
        { _id: 0 }
      );
    })
    .then(docs => {
      if (!docs) res.send(404);
      else res.json(docs);
      next();
    })
    .catch(err => next(err))
    .then(() => db.close());
};
