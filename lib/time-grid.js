'use strict'

const ONE_DAY = 24 * 3600 * 1000

module.exports =
  class TimeGrid {
    constructor (period) {
      this.period = period
      this.grid = getGrid(period)
      this.todayStart = getDayStart()
      this.data = Array(this.grid.length)
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
      this.data[pos] = data
    }

    set (data, pos) {
      this.data[pos] = data
    }

    * loadAll (loadPromise) {
      this.data = yield Promise.all(this.getCondAll().map((cond) => {
        return loadPromise(cond)
      }))
    }

    * loadLackBefore (loadPromise) {
      let res = yield Promise.all(this.getCondLackBefore().map((cond) => {
        return loadPromise(cond)
      }))

      for (var i = 0; i < res.length; i++) {
        if (res[i] !== undefined)
          this.data[i] = res[i]
      }
    }
}

function getGrid (period) {
  period *= 1000
  let list = [ 0 ]
  do {
    let val = list[list.length - 1] + period
    if (val >= ONE_DAY) break
    list.push(val)
  } while (true)
  return list
}

function getDayStart (index) {
  var d = new Date()
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d.getTime() - (index || 0) * ONE_DAY
}
