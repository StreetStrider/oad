
import { $Reader } from './Reader'

import { $Match } from './match'
import { Matched, Nothing } from './match'

import { read } from './read'
import { read_while } from './read'
import { read_until } from './read'


export type $Matcher <T = string> = (reader: $Reader) => $Match<T>


export function Literal (literal: string): $Matcher
{
	return (reader) =>
	{
		return read(reader, literal.length)
		.map(matched =>
		{
			if (matched === literal)
			{
				return matched
			}
			else
			{
				return Nothing(reader, { message: 'Literal: does not match literal' })
			}
		})
	}
}

export function Char (charclass: string): $Matcher
{
	return (reader) =>
	{
		var regexp = new RegExp(`^${ charclass }$`)

		return read(reader)
		.map(char =>
		{
			if (regexp.test(char))
			{
				return char
			}
			else
			{
				return Nothing(reader, { message: 'Char: no char at' })
			}
		})
	}
}

export function Charclass (charclass: string): $Matcher
{
	return (reader) =>
	{
		var regexp = new RegExp(`^${ charclass }$`)

		return read_while(reader, (next) => regexp.test(next))
		.map(matched =>
		{
			if (matched.length)
			{
				return matched
			}
			else
			{
				return Nothing(reader, { message: 'Charclass: does not match character class' })
			}
		})
	}
}

export function Optional <T = string> (matcher: $Matcher<T>): $Matcher<T | null>
{
	return (reader) =>
	{
		var P = matcher(reader)

		if (P.is_nothing)
		{
			return Matched(reader, null)
		}
		else
		{
			return P
		}
	}
}

export function Seq <Out extends any[] = string[]> (...matchers: { [Index in keyof Out]: $Matcher<Out[Index]> }): $Matcher<Out>
{
	return (reader) =>
	{
		var next_reader = reader
		var P
		var R = []

		for (var [ matcher, nth ] of enumerate(matchers, 1))
		{
			P = matcher(next_reader)

			if (P.is_nothing)
			{
				return Nothing(next_reader,
				{
					message: 'Seq: cannot parse nth matcher',
					nth,
					matcher,
					cause: P,
				})
			}

			next_reader = P.reader
			R.push(P.match)
		}

		return Matched(next_reader, R as Out)
	}
}

type Union <Tuple extends any[]> = Tuple[number]

export function OneOf <Out extends any[] = string[]> (...matchers: { [Index in keyof Out]: $Matcher<Out[Index]> }): $Matcher<Union<Out>>
{
	return (reader) =>
	{
		var P

		for (var [ matcher, index1 ] of enumerate(matchers, 1))
		{
			P = matcher(reader)

			if (! P.is_nothing)
			{
				return P
			}
		}

		return Nothing(reader,
		{
			message: 'OneOf: no alternatives at',
			cause: P,
		})
	}
}

export function Repeat <T = string, R = null> (element: $Matcher<T>, separator?: $Matcher<R>): $Matcher<[ T, R ][]>
{
	return (reader) =>
	{
		var next_reader = reader
		var R = ([] as ([ T, R ][]))

		for (;;)
		{
			var P = element(next_reader)

			if (P.is_nothing) break

			next_reader = P.reader

			if (separator)
			{
				var P_sep = separator(next_reader)

				if (! P_sep.is_nothing)
				{
					R.push([ P.match, P_sep.match ])

					next_reader = P_sep.reader
				}
				else
				{
					R.push([ P.match, null as unknown as R ])
					break
				}
			}
			else
			{
				R.push([ P.match, null as unknown as R ])
			}
		}

		if (! R.length)
		{
			return Nothing(next_reader)
		}
		else
		{
			return Matched(next_reader, R)
		}
	}
}

export function Total <T = string> (matcher: $Matcher<T>): $Matcher<T>
{
	return (reader) =>
	{
		var P = matcher(reader)

		if (P.is_nothing) return P

		var next_reader = P.reader

		if (next_reader.read()) return Nothing(next_reader,
		{
			message: 'Total: unconsumed content at',
		})

		return P
	}
}

type $Portal <T = string> = $Matcher<T> & { onto: $Matcher<T> | null }

export function Portal <T> (): $Portal<T>
{
	function portal (reader: $Reader)
	{
		if (! portal.onto) throw new TypeError('no_portal_onto')

		return portal.onto(reader)
	}

	portal.onto = null as any

	return portal
}


function * enumerate <T> (iterator: Iterable<T>, start_from = 0): Iterable<[ T, number ]>
{
	var n = start_from
	for (var value of iterator)
	{
		yield [ value, n++ ]
	}
}
