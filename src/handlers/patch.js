'use strict';

const MongoClient = require('mongodb').MongoClient,
  R = require('ramda');

module.exports = function collectionPatchHandler(req, res, next) {
  let db, collection;

  MongoClient.connect('mongodb://collection-db/rune')
    .then(database => {
      db = database;
      collection = db.collection('collections');
    })
    .then(() => {
      let existing = collection.findOne({
        user: req.params.user,
        slug: req.params.collection
      }, {
        _id: 0,
        cards: 1
      }).then(doc => doc.cards);

      let updated = R.map(card => {
        let model = {
          name: card.name,
          quantity: card.quantity
        };
        if (card.set) model.set = card.set;
        return model;
      }, req.body);

      return Promise.all([
        existing,
        updated
      ]);
    })
    .then(state => {
      let [ existing, updated ] = state,
        inserts = [ ],
        deletes = [ ],
        updates = [ ];

      R.forEach(card => {
        if (card.quantity <= 0) {
          deletes.push(card);
        } else if (!R.any((a, b) => a.name === b.name), existing) {
          inserts.push(card);
        } else {
          updates.push(card);
        }
      }, updated);

      return Promise.all([
        Promise.resolve(inserts),
        Promise.resolve(updates),
        Promise.resolve(deletes)
      ]);
    })
    .then(state => {
      let [ inserts, updates, deletes ] = state;

      let insertPromise = collection.insertMany(inserts);
      let updatePromise = collection.updateMany(updates);
      let deletePromise = collection.deleteMany();

      return Promise.all([
        insert,
        update,
        del
      ]);
    })
    .then(() => next())
    .catch(next)
    .then(db.close);
};
