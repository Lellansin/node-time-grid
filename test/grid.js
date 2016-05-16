'use strict'

const co = require('co')
const Grid = require('..').grid

let start = new Date('2016-05-16 13:05:00').getTime()
let end = new Date().getTime()
let grid = new Grid(start, end)

co(function * () {
  let i = 100
  yield grid.loadAll(function (cond) {
    console.log(cond)
    return i++
  })
  grid.push(456)
  console.log(grid.report())
})
