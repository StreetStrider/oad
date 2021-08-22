
import between from './between'

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

	/*
	function is_end ()
	{
		return (pin === pin_end)
	}
	*/

	function repr ()
	{
		var [ prep, char, post ] = [ source.slice(0, pin), source.slice(pin, pin + 1), source.slice(pin + 1) ]

		prep  = replace_control(prep)
		char = replace_control(char)
		post  = replace_control(post)

		return `(${ pin }): ${ prep }\x1b[4;7m${ char || '∅' }\x1b[0m${ post }`
	}

	var reader =
	{
		source,
		pin,
		read,
		// is_end,
		repr,
	}

	return reader as $Reader
}


function replace_control (input: string)
{
	return input.replace(/\n/g, '␍')
}
