'use strict'

const co = require('co')
const MongoClient = require('mongodb').MongoClient
const Grid = require('..')

let g = new Grid(3600 * 2)

co(function * () {
  let i = 200
  let db = yield MongoClient.connect('mongodb://localhost:27017/mydb')
  let collection = db.collection('test')

  yield g.loadAll(function * (condition) {
    let docs = yield collection.find({ createAt: condition }).toArray()
    return i++
  })

  yield g.saveAll(function * (info) {
    let res = yield collection.update({ time: info.time }, { data: info.data, time: info.time }, { upsert: true })
    console.log('res', res)
    return res
  })

  console.log('saveAll over...')
  process.exit()
}).catch(console.error)

setTimeout(() => process.exit, 20 * 1000)
