
import { pipe } from '@arrows/composition'

import Reader from './lib/Reader'

import { read } from './lib/read'

import { $Matcher } from './lib/matcher'

import { Literal } from './lib/matcher'
import { Charclass } from './lib/matcher'
import { Optional } from './lib/matcher'
import { Seq } from './lib/matcher'
import { OneOf } from './lib/matcher'
import { Repeat } from './lib/matcher'
import { Total } from './lib/matcher'
import { Portal } from './lib/matcher'

import { Name } from './lib/decorate'
import { Translate } from './lib/decorate'
import { Tokenize } from './lib/decorate'
import { Literize } from './lib/decorate'

var space = Charclass('\\s')
var plus = pipe.now(Literal('+'), Literize('@plus'))
var number = pipe.now(Charclass('\\d'), Translate(Number), Tokenize('@number'))
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

var program = Total(Repeat(Spaced(expr), sep))

expr_portal.onto = expr

// var r = Reader(`123  +   345`)
var r = Reader(`123  +   345 ; 100   +100;`)

var P = program(r)

console.info(P.reader.repr())
console.dir(P.repr(), { depth: Infinity })
