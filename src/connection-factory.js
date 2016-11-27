'use strict';

const mongoose = require('mongoose'),
  Piloted      = require('piloted');

let connection;

exports.create = function createConnection() {
  if (!connection) {
    mongoose.Promise = Promise;
    let uri = buildServerUri();
    connection = mongoose.connect(uri);
  }
  return connection;
};

function buildServerUri() {
  let server = Piloted('collection-replset');
  return `mongodb://${server.address}:${server.port}`;
}
