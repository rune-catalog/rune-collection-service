'use strict';

const mb            = require('mb-promise'),
  Wreck             = require('wreck'),
  { before, after } = require('mocha');

let consulConfig = {
  port: 8500,
  protocol: 'http',
  stubs: [
    {
      responses: [
        {
          is: {
            status: 200,
            body: [
              {
                Service: {
                  Address: '127.0.0.1',
                  Port: 27017
                }
              }
            ]
          }
        }
      ]
    }
  ]
};

before(done => {
  mb.start({ loglevel: 'warn' })
  .then(() => {
    let opts = { payload: consulConfig };
    Wreck.post('http://localhost:2525/imposters', opts, done);
  });
});

after(mb.stop);
