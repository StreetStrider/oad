
import Reader from './lib/Reader'

import { read } from './lib/Reader'
import { read_until } from './lib/Reader'

import { Literal } from './lib/matcher'
import { Regexp } from './lib/matcher'
import { Num } from './lib/matcher'

// var r = Reader('abc')
var r = Reader('123b')

// console.log(r.repr())

// console.log('until', read_until(r, 'd'))

var literal = Literal('ab')
var regexp = Regexp(() => /[ab]+/, 'c')
var num = Num()

var m = num

var pr = m(r)
console.log(pr)
console.log(pr.reader.repr())

// console.log(read(r, 1).map(() => 1))
// console.log(read(r, 3).map(() => 2))
// console.log(read(r, 5).map(() => 3))
