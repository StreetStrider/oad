


export const Reduce: unique symbol = Symbol('Reduce')

export function traverse (tree: any, mapper: (match: any) => any): any
{
	if (! is_object(tree))
	{
		return mapper(tree)
	}

	if (is_array(tree))
	{
		var copy_a = []

		for (var subtree of tree)
		{
			var m = traverse(subtree, mapper)

			if (m !== Reduce)
			{
				copy_a.push(m)
			}
		}

		return mapper(copy_a)
	}

	var copy = {}

	for (var key in tree)
	{
		var m = traverse(tree[key], mapper)

		if (m !== Reduce)
		{
			(copy as any)[key] = m
		}
	}

	return mapper(copy)
}


export function when (pred: (match: any) => boolean, mapper: (match: any) => any)
{
	return (value: any) =>
	{
		if (pred(value))
		{
			return mapper(value)
		}
		else
		{
			return value
		}
	}
}


export function trim ()
{
	return when((match: any) =>
	{
		if (match == null) return true
		if ((typeof match === 'string') && (match[0] !== '@')) return true
		return false
	},
	() => Reduce)
}


export function flatten ()
{
	return when((match) =>
	{
		if (! is_array(match)) return false
		if (match.length !== 1) return false
		return true
	},
	(match) => match[0])
}


function is_object (value: any): value is Object
{
	return (value === Object(value))
}

function is_array (value: any): value is Array<any>
{
	return Array.isArray(value)
}
