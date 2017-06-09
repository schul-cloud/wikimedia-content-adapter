
//  QUELLE :
// https://de.wikipedia.org/wiki/URL-Encoding#Relevante_ASCII-Zeichen_in_Prozentdarstellung
//	␣	!	"	#	$	%	&	'	(	)	*	+	,	/	:	;	=	?	@	[	\	]	{	|	}
//	%20	%21	%22	%23	%24	%25	%26	%27	%28	%29	%2A	%2B	%2C	%2F	%3A	%3B	%3D	%3F	%40	%5B	%5C	%5D	%7B	%7C	%7D
// AS UNICODE
var URLsymbolsMAP = new Map(	[
	["%","%25"],
	[" ","%20"],
	["!","%21"],
	['"',"%22"],
	["$","%23"],
	["#","%24"],
	["&","%26"],
	["'","%27"],
	["(","%28"],
	[")","%29"],
	["*","%2A"],
	["+","%2B"],
	[",","%2C"],
	["/","%2F"],
	[":","%3A"],
	[";","%3B"],
	["=","%3D"],
	["?","%3F"],
	["@","%40"],
	["[","%5B"],
	["\\","%5C"],
	["]","%5D"],
	["{","%7B"],
	["|","%7C"],
	["}","%7D"]
	]
	);

function clearName(string){
	for(var key of URLsymbolsMAP){
		string = string.replace(new RegExp("\\"+key[0],"g"),key[1]);
	}
	return string;
}

module.exports.prepear4URL = clearName;
