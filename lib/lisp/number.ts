
import { pipe } from '@arrows/composition'

import { OneOf } from '../matcher'
import { Literal } from '../matcher'
import { Charclass } from '../matcher'
import { Char } from '../matcher'
import { Repeat } from '../matcher'
import { Seq } from '../matcher'
import { Optional } from '../matcher'

import { Tokenize } from '../decorate'
import { Translate } from '../decorate'

import { find } from '../traverse'
import { traverse } from '../traverse'
import { flatten } from '../traverse'
import { by_token } from '../traverse'


var sign = pipe.now(
	OneOf(Literal('+'), Literal('-')),
	Tokenize('sign'),
)

var decimal = Charclass('[01-9]')
var decimal_lead = Char('[1-9]')
var comma = Literal(',')
var dot = Literal('.')

var integer_comma = Repeat(decimal, comma)

var integer = pipe.now(
	OneOf(
		Literal('0'),
		Seq(decimal_lead, Optional(comma), Optional(integer_comma))
	),
	Tokenize('integer'),
)

var fraction = pipe.now(
	Seq(
		dot,
		integer_comma,
	),
	Tokenize('fraction'),
)

var number = pipe.now(
	Seq(
		Optional(sign),
		OneOf(
			Seq(integer, fraction),
			integer,
			fraction,
		)
	),

	Tokenize('number'),
	Translate(match =>
	{
		var sign = find(match, by_token('sign'))?.match ?? '+'
		var sign1 = ((sign === '-') && -1 || 1)

		var integer = find(match, by_token('integer'))?.match ?? []
		integer = linear(integer)

		var fraction = find(match, by_token('fraction'))?.match ?? []
		fraction = linear(fraction)
		if (fraction > 0)
		{
			var base = Math.ceil(Math.log10(fraction))
			fraction = (fraction / Math.pow(10, base))
		}

		var number = (integer + fraction)
		if (number)
		{
			number = (sign1 * number)
		}

		return { ...match, match: number }

		function linear (seq: any): any
		{
			seq = [].concat(seq)
			seq = traverse(seq, flatten())
			seq = seq.filter(Boolean)
			seq = seq.filter((group: any) => (group !== ','))
			seq = seq.filter((group: any) => (group !== '.'))
			seq = seq.join('')
			return Number(seq)
		}
	})
)

export default number
