'use strict'

const ONE_DAY = 24 * 3600 * 1000

exports.getDayStart = function (index) {
  if (index && index.constructor === Date)
    return getZeroTime(index)
  return getZeroTime(new Date).getTime() - (index || 0) * ONE_DAY
}

exports.getGrid = function (period) {
  period *= 1000
  let list = [ 0 ]
  do {
    let val = list[list.length - 1] + period
    if (val >= ONE_DAY) break
    list.push(val)
  } while (true)
  return list
}

exports.timeToday = function (d) {
  return zeroFill(d.getHours()) + ':' +
  zeroFill(d.getMinutes()) + ':' +
  zeroFill(d.getSeconds())
}

function zeroFill (str) {
  if (typeof str != 'string') {
    str = new String(str)
  }
  if (str.length < 2) {
    return '0' + str
  }
  return str
}

function getZeroTime (date) {
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}
