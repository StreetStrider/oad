
import { $Match, Matched, Nothing } from './match'
import { $Reader } from './Reader'


export function read (reader: $Reader, n: number = 1): $Match<string>
{
	var pr = reader.read(n)

	if (! pr) return Nothing(reader)

	return Matched(pr[0], pr[1])
}

export function read_while (reader: $Reader, fn_while: (next: string, after: $Reader) => boolean)
{
	var P
	var reader_next = reader
	var next
	var R = ''

	while (P = reader_next.read())
	{
		[ reader_next, next ] = P

		if (! fn_while(next, reader_next)) break

		reader = reader_next
		R = (R + next)
	}

	return Matched(reader, R)
}

export function read_until (reader: $Reader, fn_until: (next: string, after: $Reader) => boolean)
{
	return read_while(reader, (next, after) =>
	{
		return ! fn_until(next, after)
	})
}
