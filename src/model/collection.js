'use strict';

const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  name: String,
  slug: String,
  user: String,
  cards: [ ]
}, {
  id: false,
  toJSON: { getters: true, transform: transformCollection }
});

function transformCollection(doc, ret) {
  delete ret.__v;
  delete ret._id;
  return ret;
}

module.exports = mongoose.model('Collection', schema);
