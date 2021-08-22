
import Reader from './lib/Reader'

import { read } from './lib/read'

import { $Matcher } from './lib/matcher'
import { Literal } from './lib/matcher'
import { Charclass } from './lib/matcher'
import { Num } from './lib/matcher'
import { Line } from './lib/matcher'
import { Optional } from './lib/matcher'
import { Seq } from './lib/matcher'
import { OneOf } from './lib/matcher'
import { Repeat } from './lib/matcher'
import { Portal } from './lib/matcher'

var plus = Literal('+')
var space = Charclass('\\s')
var number = Num()
var sep = Literal(';')

function Spaced <T = string> (matcher: $Matcher<T>)
{
	return Seq(Optional(space), matcher, Optional(space))
}

var expr_portal = Portal()

var binop = Seq(number, Spaced(plus), expr_portal)

var expr = OneOf(
	binop,
	number,
)

var program = Repeat(Spaced(expr), sep)

expr_portal.onto = expr

// var r = Reader(`123  +   345`)
var r = Reader(`123  +   345 ; 100   +100;`)

var P = program(r)

console.info(P.reader.repr())
console.dir(P.is_nothing || P.match, { depth: Infinity })
