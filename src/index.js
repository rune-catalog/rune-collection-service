'use strict';

const restify = require('restify');

let server = restify.createServer();
server.use(restify.CORS());
server.use(restify.bodyParser({
  mapParams: false
}));

server.get('/collection/:user', require('./handlers/browse'));
server.get('/collection/:user/:collection', require('./handlers/get'));
server.post('/collection/:user', require('./handlers/post'));
server.patch('/collection/:user/:collection', require('./handlers/patch'));

server.on('uncaughtException', (req, res, route, err) => {
  console.error(err);
  res.send(err);
});

server.on('after', (req, res, route, err) => {
  if (err) {
    if (err.message) {
      console.error(err.message);
      console.error(err.stack);
    } else {
      console.error(err);
    }
  }
});

server.listen(8080, () => {
  console.log(`${server.name} listening on ${server.url}`);
});
