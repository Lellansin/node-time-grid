'use strict'

const co = require('co')
const utils = require('./utils')

module.exports =
  class TimeGrid {
    constructor (period, day) {
      this.period = period
      this.grid = utils.getGrid(period)
      this.todayStart = utils.getDayStart(day)
      this.data = Array(this.grid.length).fill(null)
      this._isSaved = Array(this.grid.length).fill(null)
    }

    getCondAll () {
      return this.grid.map((offset) => {
        let start = this.todayStart + offset
        return {
          $gte: start,
          $lt: start + this.period
        }
      })
    }

    getCondLack () {
      return this.getCondAll().filter((cond, pos) => {
        return !this.data[pos]
      })
    }

    getCondLack () {
      return this.getCondAll().filter((cond, pos) => {
        return !this.data[pos]
      })
    }

    getCondLackBefore () {
      console.log('getCondLackBefore')
      return this
        .getCondAll()
        .slice(0, this.getPosNow() + 1)
        .filter((cond, pos) => {
          return !this.data[pos]
        })
    }

    getPosNow () {
      let now = Date.now() - this.todayStart
      let index = 0
      for (let i = this.grid.length - 1; i >= 0; i--) {
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
        // day passed
      }
      this.data[pos] = data
    }

    set (data, pos) {
      this.data[pos] = data
    }

    report () {
      return {
        time: this.grid.map((t) => utils.timeToday(new Date(this.todayStart + t))),
        data: this.data.map((x) => x ? x : 0)
      }
    }

    * loadAll (loadPromise) {
      this.data = yield Promise.all(this.getCondAll().map((cond) => {
        return co(loadPromise(cond))
      }))
    }

    * loadLackBefore (loadPromise) {
      let res = yield Promise.all(this.getCondLackBefore().map((cond) => {
        return co(loadPromise(cond))
      }))

      for (var i = 0; i < res.length; i++) {
        if (res[i] !== null)
          this.data[i] = res[i]
      }
    }

    * loadLackBefore (loadPromise) {
      let res = yield Promise.all(this.getCondLackBefore().map((cond) => {
        return co(loadPromise(cond))
      }))

      for (var i = 0; i < res.length; i++) {
        if (res[i] !== null)
          this.data[i] = res[i]
      }
    }

    * saveAll (savePromise) {
      yield Promise.all(this.data.map((data, pos) => {
        if (data) {
          let time = this.todayStart + this.grid[pos]
          setSaved(pos)
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
