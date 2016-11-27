'use strict';

const request = require('supertest'),
  api = require('../src/boot');

describe('GET /status', () => {
  let agent;

  before(() => api.boot().then(api => agent = request(api)));

  it('should respond with 200', done => {
    agent.get('/status').expect(200, done);
  });
});
