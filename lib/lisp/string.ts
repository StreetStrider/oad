


function Quotation (quote: string)
{

}

function Body (quote: string)
{
	return Charclass(`[^${ quote }]`)
}

var escape = Seq(Literal('\\'), Char('.'))
