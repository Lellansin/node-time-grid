'use strict'

const co = require('co')
const MongoClient = require('mongodb').MongoClient
const Grid = require('..')

let g = new Grid(3600 * 2)

co(function * () {
  let i = 100
  let db = yield MongoClient.connect('mongodb://localhost:27017/perf')
  let collection = db.collection('analy')

  yield g.loadAll(function * (condition) {
    let docs = yield collection.find({ createAt: condition }).toArray()
    return docs.length || i++
  })

  console.log(g.report())
  process.exit()
}).catch(console.error)
