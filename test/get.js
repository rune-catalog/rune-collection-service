'use strict';

const api                  = require('../src/boot'),
  request                  = require('supertest'),
  { before, it, describe } = require('mocha'),
  Collection               = require('../src/model/collection');

describe('GET /collection/:user/:slug', () => {
  let agent;

  before(() => {
    return api.boot()
      .then(api => {
        api.log.level('FATAL');
        agent = request(api);
      })
      .then(() => Collection.remove({ }))
      .then(() => Collection.create([
        {
          name: 'Test',
          slug: 'test',
          user: 'dude'
        }
      ]));
  });

  it('should respond with JSON', done => {
    agent.get('/collection/dude/test')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should respond with 404 collection does not exist', done => {
    agent.get('/collection/dude/doesnotexist')
      .expect(404, done);
  });

  it('should respond with collection', done => {
    agent.get('/collection/dude/test')
      .expect({
        name: 'Test',
        slug: 'test',
        user: 'dude',
        cards: [ ]
      })
      .expect(200, done);
  });

  it('should implicitly create default collection', done => {
    agent.get('/collection/dude/default')
      .expect(200, done);
  });
});
