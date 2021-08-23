
var descr = Object.getOwnPropertyDescriptor
import def from 'def-prop'

import { pipe } from '@arrows/composition'

import { $Reader } from './Reader'

import { $Match } from './match'
import { Matched, Nothing } from './match'

import { $Matcher } from './matcher'


export function Name (name: string)
{
	return function <T = string> (matcher: $Matcher<T>): $Matcher<T>
	{
		var fn: $Matcher<T> = function (reader)
		{
			return matcher(reader)
		}

		var d = descr(fn, 'name') as PropertyDescriptor
		d.value = name
		def(fn, 'name', d)

		return fn
	}
}


export function Translate <T, R> (fn: (match: T) => R)
{
	return function (matcher: $Matcher<T>): $Matcher<R>
	{
		return (reader) =>
		{
			return matcher(reader).map(fn)
		}
	}
}


export function Tokenize (token: string)
{
	return function <T = string> (matcher: $Matcher<T>)
	{
		return pipe.now(matcher, Translate(tokenize), Name(token))
	}

	function tokenize <T> (match: T)
	{
		return { token, match }
	}
}


export function Literize (token: string)
{
	return function <T = string> (matcher: $Matcher<T>)
	{
		return pipe.now(matcher, Translate(literize), Name(token))
	}

	function literize (match: any)
	{
		return { token }
	}
}
