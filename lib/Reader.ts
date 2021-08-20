
import between from './between'
import { $Match, Matched, Nothing } from './match'

export interface $Reader
{
	source: string,
	pin: number,
	read (n?: number): [ $Reader, string ] | null,
	repr (): void,
}


export default function Reader (source: string, pin: number = 0): $Reader
{
	var pin_end = source.length
	pin = between(pin, [ 0, pin_end ])

	function read (n: number = 1)
	{
		var offset = (pin + n)
		if (offset > pin_end) return null

		return [ Reader(source, offset), source.slice(pin, offset) ]
	}

	function is_end ()
	{
		return (pin === pin_end)
	}

	function repr ()
	{
		var [ pre, char, pos ] = [ source.slice(0, pin), source.slice(pin, pin + 1), source.slice(pin + 1) ]

		return `${ pin }: ${ pre }\x1b[4;7m${ char || ' ' }\x1b[0m${ pos }`
	}

	var reader =
	{
		source,
		pin,
		read,
		is_end,
		repr,
	}

	return reader as $Reader
}


export function read (reader: $Reader, n: number = 1): $Match<string>
{
	var pr = reader.read(n)

	if (! pr) return Nothing(reader)

	return Matched(pr[0], pr[1])
}

export function read_until (reader: $Reader, limit_sequence: string = ' ')
{
	limit_sequence || (limit_sequence = ' ')

	var head = limit_sequence[0]
	var tail = limit_sequence.slice(1)

	var pr
	var prev_reader = reader
	var next
	var next_reader = reader
	var R = ''

	while (pr = next_reader.read())
	{
		[ next_reader, next ] = pr

		if (next === head)
		{
			if (! tail.length) break

			var pr_end = next_reader.read(tail.length - 1)

			if (pr_end && (pr_end[1] === tail)) break
		}

		R = (R + next)
		prev_reader = next_reader
	}

	return Matched(prev_reader, R)
}
