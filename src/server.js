'use strict';

const restify = require('restify');

exports.initHandlers = function initHandlers(server) {
  server.get('/status',                         require('./handlers/status'));
  server.get('/collection/:user',               require('./handlers/browse'));
  server.post('/collection/:user',              require('./handlers/post'));
  server.get('/collection/:user/:collection',   require('./handlers/get'));
  server.patch('/collection/:user/:collection', require('./handlers/patch'));

  return server;
};

exports.initEvents = function initEvents(server) {
  server.on('after', (req, res, route, err) => {
    if (err) {
      server.log.error(err);
    }
  });

  server.on('uncaughtException', (req, res, route, err) => {
    server.log.error(err);
  });

  return server;
};

exports.initMiddleware = function initMiddleware(server) {
  server.use(restify.bodyParser({
    mapParams: false
  }));

  return server;
};

exports.start = function startServer(server) {
  server.listen(8080, () => {
    server.log.info(`${server.name} listening on ${server.url}`);
  });
}
