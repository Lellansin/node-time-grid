'use strict'

const co = require('co')
const utils = require('./utils')

module.exports =
  class TimeGrid {
    constructor (start, end, period) {
      this.period = period || 5 * 60 * 1000
      this.grid = utils.getPeriodGrid(start, end, this.period)
      this.data = Array(this.grid.length).fill(null)
      this._isSaved = Array(this.grid.length).fill(null)
    }

    getCondAll () {
      return this.grid.map((now) => {
        return {
          $gte: now,
          $lt: now + this.period
        }
      })
    }

    getPosNow () {
      let now = Date.now(), index = 0
      let length = this.grid.length
      if (now > this.grid[length - 1 ] + this.period) {
        return length
      }
      for (let i = length - 1; i >= 0; i--) {
        let val = this.grid[i]
        if (now > val) {
          index = i
          break
        }
      }
      return index
    }

    push (data) {
      let pos = this.getPosNow()
      if (pos >= this.grid.length) {
        this.grid.shift()
        this.grid.push(this.grid[this.grid.length - 1] + this.period)
        this.data.shift()
        this.data.push(data)
        this._isSaved.shift()
        this._isSaved.push(null)
        return
      }
      this.data[pos] = data
    }

    report () {
      return {
        time: this.grid.map((t) => utils.timeToday(new Date(t))),
        data: this.data.map((x) => x ? x : 0)
      }
    }

    * loadAll (loadPromise) {
      this.data = yield Promise.all(this.getCondAll().map((cond) => {
        return co(loadPromise(cond))
      }))
    }

    * saveAll (savePromise) {
      yield Promise.all(this.data.map((data, pos) => {
        if (data && !this.isSaved(pos)) {
          let time = this.grid[pos]
          this.setSaved(pos)
          return co(savePromise({ data, time}))
        }
        return Promise.resolve(true)
      }))
    }

    setSaved (pos) {
      this._isSaved[pos] = true
    }

    isSaved (pos) {
      return !!this._isSaved[pos]
    }
}
