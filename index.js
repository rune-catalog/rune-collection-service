'use strict';

const restify = require('restify'),
  slug = require('slug'),
  MongoClient = require('mongodb').MongoClient,
  R = require('ramda')

let server = restify.createServer()

server.use(restify.bodyParser({
  mapParams: false
}))

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

server.patch('/collection/:user/:collection', (req, res, next) => {
  let db, collection

  MongoClient.connect('mongodb://localhost:27017/rune')
    .then(database => {
      db = database
      collection = db.collection('collections')
    })
    .then(() => {
      let existing = collection.findOne({
        user: req.params.user,
        slug: req.params.collection
      }, {
        _id: 0,
        cards: 1
      }).then(doc => doc.cards)

      let updated = R.map(card => {
        let model = {
          name: card.name,
          quantity: card.quantity
        }
        if (card.set) model.set = card.set
        return model
      }, req.body)

      return Promise.all([
        existing,
        updated
      ])
    })
    .then(state => {
      let [ existing, updated ] = state,
        inserts = [ ],
        deletes = [ ],
        updates = [ ]

      R.forEach(card => {
        if (card.quantity <= 0) {
          deletes.push(card)
        }
        else if (!R.any((a, b) => a.name === b.name), existing) {
          inserts.push(card)
        }
        else {
          updates.push(card)
        }
      }, updated)

      return Promise.all([
        Promise.resolve(inserts),
        Promise.resolve(updates),
        Promise.resolve(deletes)
      ])
    })
    .then(state => {
      let [ inserts, updates, deletes ] = state

      let insertPromise = collection.insertMany(inserts)
      let updatePromise = collection.updateMany(updates)
      let deletePromise = collection.deleteMany()

      return Promise.all([
        insert,
        update,
        del
      ])
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
