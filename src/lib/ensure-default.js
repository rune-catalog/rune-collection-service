'use strict';

const Collection = require('../model/collection');

exports.ensureDefaultCollection = function ensureDefaultCollection(user) {
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
