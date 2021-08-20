
import { $Reader } from './Reader'


export type $Match <T = string> = $Matched<T> | $Nothing


export interface $Matched <T = string>
{
	is_nothing: false,
	reader: $Reader,
	match: T,
	map (fn: (input: T) => $Nothing): $Nothing,
	map <R> (fn: (input: T) => R | $Nothing): $Matched<R> | $Nothing,
	map <R> (fn: (input: T) => R): $Matched<R>,
}

export function Matched <T = string> (reader: $Reader, match: T): $Matched<T>
{
	return {
		is_nothing: false,
		reader,
		match,
		map (fn: any): any
		{
			var pr = fn(match)

			if (pr?.is_nothing)
			{
				return Nothing(reader)
			}

			return Matched(reader, pr)
		},
	}
}


export interface $Nothing
{
	is_nothing: true,
	reader: $Reader,
	map (fn: (input: any) => any): $Nothing,
}

export function Nothing (reader: $Reader): $Nothing
{
	return {
		is_nothing: true,
		reader,
		map (fn: any): $Nothing
		{
			return Nothing(reader)
		}
	}
}
