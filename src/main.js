'use strict';

const api   = require('./boot'),
  serverApi = require('./server');

exports.main = function main() {
  api.boot().then(serverApi.start);
};
