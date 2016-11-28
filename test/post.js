'use strict';

const api                  = require('../src/boot'),
  request                  = require('supertest'),
  Collection               = require('../src/model/collection'),
  expect                   = require('code').expect,
  { before, it, describe } = require('mocha');

describe('POST /collections/:user', () => {
  let agent;

  before(() => {
    return api.boot()
    .then(api => {
      api.log.level('FATAL');
      agent = request(api);
    })
      .then(() => Collection.remove({ }));
  })

  it('should respond with JSON', done => {
    agent.post('/collection/dude')
      .send({ name: 'JSON Test Case' })
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should respond with 409 when collection name exists', done => {
    agent.post('/collection/dude')
      .send({ name: 'JSON Test Case' })
      .expect(409, done);
  });

  it('should generate a new slug instead of creating a dup', done => {
    agent.post('/collection/dude')
      .send({ name: 'json-test-case' })
      .expect(res => expect(res.body.slug).to.equal('json-test-case-1'), done)
      .expect(200, done);
  });

  it('should create a new collection', () => {
    return agent.post('/collection/dude')
      .send({ name: 'New Collection' })
      .then(() => Collection.findOne({ name: 'New Collection' }))
      .then(doc => expect(doc.name).to.equal('New Collection'));
  });

  it('should respond with the created collection', done => {
    agent.post('/collection/dude')
      .send({ name: 'Foo Collection' })
      .expect({
        name: 'Foo Collection',
        slug: 'foo-collection',
        user: 'dude',
        cards: [ ]
      }, done);
  });
});
