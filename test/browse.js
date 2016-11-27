'use strict';

const api    = require('../src/boot'),
  expect     = require('code').expect,
  request    = require('supertest'),
  Collection = require('../src/model/collection');

describe('GET /collection/:userid', () => {
  let agent;

  before(() => {
    return api.boot()
      .then(api => agent = request(api))
      .then(() => Collection.remove({ }));
  });

  it('should respond with JSON', done => {
    agent.get('/collection/dude')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should implicitly create default collections', done => {
    agent.get('/collection/dude')
    .expect([
      {
        name: 'Default',
        slug: 'default',
        user: 'dude',
        cards: [ ]
      }
    ], done);
  });

  describe('non-default collections', done => {
    before(() => {
      return Collection.create([
        {
          name: 'Test',
          code: 'test',
          user: 'dude',
          cards: [ ]
        }
      ]);
    });

    it('should return non-default collections', done => {
      agent.get('/collection/dude')
        .expect(res => expect(res.body.length).to.equal(2))
        .expect(200, done);
    });
  });
});
