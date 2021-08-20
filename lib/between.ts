
export default function between (x: number, bound: [ number, number ])
{
	x = Math.max(x, bound[0])
	x = Math.min(x, bound[1])
	return x
}
