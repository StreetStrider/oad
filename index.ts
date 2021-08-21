
import Reader from './lib/Reader'

import { read } from './lib/read'
// import { read_until } from './lib/read'

import { Literal } from './lib/matcher'
import { Charclass } from './lib/matcher'
import { Num } from './lib/matcher'
import { Line } from './lib/matcher'
// import { OneOf } from './lib/matcher'
import { Seq } from './lib/matcher'

var plus = Literal('+')
var space = Charclass('\\s')
var number = Num()
var sep = Literal(';')

// var expr = OneOf(sum, expr)
// var program = Seq(expr)

// var r = Reader('abc')
var r = Reader(`123  +   345; 111+222`)

var m = Seq(number, space)

var P = m(r)
// console.info(P)
console.info(P.reader.repr())
console.info(P.is_nothing || P.match)

// console.log(read(r, 1).map(() => 1))
// console.log(read(r, 3).map(() => 2))
// console.log(read(r, 5).map(() => 3))
