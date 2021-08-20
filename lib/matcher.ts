
import { $Reader } from './Reader'
import { $Match } from './match'

import { read } from './Reader'
import { read_until } from './Reader'
import { Nothing } from './match'


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

export function Regexp (regexp: () => RegExp, limit_sequence: string = ' '): $Matcher
{
	return (reader) =>
	{
		var pr = read_until(reader, limit_sequence)

		return pr.map(matched =>
		{
			var reg_match = matched.match(regexp())
			if (! reg_match) return Nothing(reader)
			if ((reg_match.index as number) > 0) return Nothing(reader)
			if (reg_match.length < matched.length) return Nothing(reader)
			return reg_match[0]
		})
	}
}

export function Num ()
{
	return Regexp(() => /\d+/)
}
