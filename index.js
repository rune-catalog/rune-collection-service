'use strict';

const restify = require('restify'),
  slug = require('slug'),
  MongoClient = require('mongodb').MongoClient

let server = restify.createServer()

server.use(restify.bodyParser())

server.get('/collection/:user/:collection', (req, res, next) => {
  let db

  MongoClient.connect('mongodb://localhost:27017/rune')
    .then(database => {
      db = database
      let collection = db.collection('collections')
      return collection.findOne(
        { slug: req.params.collection },
        { _id: 0 }
      )
    })
    .then(docs => {
      if (!docs) res.send(404)
      else res.json(docs)
    })
    .catch(err => next(err))
    .then(() => {
      db.close()
      next()
    })
})

server.post('/collection/:user', (req, res, next) => {
  let db

  let collectionSlug = slug(req.body.name, { lower: true })

  let model = {
    name: req.body.name,
    user: req.params.user,
    slug: collectionSlug,
    cards: [ ]
  }

  res.json(model)

  MongoClient.connect('mongodb://localhost:27017/rune')
    .then(database => {
      db = database
      let collection = db.collection('collections')
      return collection.insertOne(model);
    })
    .catch(err => next(err))
    .then(() => {
      db.close()
      next()
    })
})

server.on('uncaughtException', (req, res, route, err) => {
  console.error(err)
  res.send(err)
})

server.listen(8081, () => {
  console.log(`${server.name} listening on ${server.url}`)
})
