
var Grid = require('..')
var g = new Grid(3600)
var conds = g.getCondLackBefore();
console.log(conds.length)
