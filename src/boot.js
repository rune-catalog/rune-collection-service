'use strict';

const serverApi     = require('./server'),
  autopilot         = require('./autopilot'),
  connectionFactory = require('./connection-factory'),
  ContainerPilot    = require('../containerpilot.json'),
  restify           = require('restify');

exports.boot = function boot() {
  const server = restify.createServer();

  return autopilot(ContainerPilot)
    .then(connectionFactory.create)
    .then(() => server)
    .then(serverApi.initHandlers)
    .then(serverApi.initMiddleware)
    .then(serverApi.initEvents);
};
