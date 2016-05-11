'use strict'

const co = require('co')
const MongoClient = require('mongodb').MongoClient
const Grid = require('..')

let g = new Grid(3600 * 2)

co(function * () {
  let db = yield MongoClient.connect('mongodb://localhost:27017/mydb')
  let collection = db.collection('test')

  yield g.loadAll(function * (condition) {
    let doc = yield collection.findOne({ time: condition })
    return doc.data
  })

  console.log(g.report())
  process.exit()
}).catch(console.error)
