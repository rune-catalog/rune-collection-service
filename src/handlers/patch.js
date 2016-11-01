'use strict';

const MongoClient = require('mongodb').MongoClient,
  R = require('ramda');

module.exports = function collectionPatchHandler(req, res, next) {
  let db, collection, username = req.params.user, slug = req.params.collection;

  MongoClient.connect('mongodb://collection-db/rune')
    .then(database => {
      db = database;
      collection = db.collection('collections');
    })
    .then(() => resolveExistingAndUpdated(collection, username, slug, req.body))
    .then(resolveDbChanges)
    .then(state => executeDbChanges(collection, state, username, slug))
    .then(() => res.send(200))
    .then(() => next())
    .catch(err => next(err))
    .then(() => db.close());
};

function resolveExistingAndUpdated(dbCollection, username, slug, requestBody) {
  let existing = dbCollection.findOne({
    user: username,
    slug
  }).then(doc => doc.cards);

  let updated = R.map(card => ({
      name: card.name,
      quantity: card.quantity
  }), requestBody);

  return Promise.all([
    existing,
    Promise.resolve(updated)
  ]);
}

function resolveDbChanges(state) {
  let [ existing, updated ] = state,
    inserts = [ ],
    deletes = [ ],
    updates = [ ];

  R.forEach(card => {
    if (card.quantity <= 0) {
      deletes.push(card);
    } else if (!R.any(R.propEq('name', card.name), existing)) {
      inserts.push(card);
    } else {
      updates.push(card);
    }
  }, updated);

  return [ existing, inserts, updates, deletes ];
}

function executeDbChanges(dbCollection, state, username, slug) {
  let [ existing, inserts, updates, deletes ] = state;

  // Filter out deleted cards
  existing = R.filter(card => !R.any(c => c.name === card.name, deletes), existing);

  // Update existing cards
  R.forEach(update => {
    let obj = R.find(R.propEq('name', update.name), existing);
    obj.quantity = update.quantity;
  }, updates);

  // Add new cards
  R.forEach(card => existing.push(card), inserts);

  return dbCollection.updateOne({
    user: username,
    slug
  }, {
    $set: { cards: existing }
  });
}
