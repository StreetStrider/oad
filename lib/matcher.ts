
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
		var pr = read(reader, literal.length)

		return pr.map(matched =>
		{
			if (matched === literal)
			{
				return matched
			}
			else
			{
				return Nothing(reader)
			}
		})
	}
}

export function Charclass (charclass: string): $Matcher
{
	return (reader) =>
	{
		var regexp = new RegExp(`^${ charclass }$`)
		var P = read_while(reader, (next) => regexp.test(next))
		return P.map(matched =>
		{
			if (matched.length)
			{
				return matched
			}
			else
			{
				return Nothing(reader)
			}
		})
	}
}

export function Num ()
{
	return Charclass('\\d')
}

export function Line (): $Matcher
{
	return (reader) =>
	{
		return read_until(reader, next => (next === '\n'))
	}
}

export function Seq <Out extends any[]> (...matchers: { [Index in keyof Out]: $Matcher<Out[Index]> }): $Matcher<Out>
{
	return (reader) =>
	{
		var next_reader = reader
		var P
		var R = []

		for (var matcher of matchers)
		{
			P = matcher(next_reader)

			if (P.is_nothing)
			{
				return Nothing(reader)
			}

			next_reader = P.reader
			R.push(P.match)
		}

		return Matched(next_reader, R as Out)
	}
}
