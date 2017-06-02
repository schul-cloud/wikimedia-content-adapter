
//  QUELLE :
// https://de.wikipedia.org/wiki/URL-Encoding#Relevante_ASCII-Zeichen_in_Prozentdarstellung
//	␣	!	"	#	$	%	&	'	(	)	*	+	,	/	:	;	=	?	@	[	\	]	{	|	}
//	%20	%21	%22	%23	%24	%25	%26	%27	%28	%29	%2A	%2B	%2C	%2F	%3A	%3B	%3D	%3F	%40	%5B	%5C	%5D	%7B	%7C	%7D
var URLsymbolsMAP = new Map(	[["␣","%20"],	["!","%21"],	['"',"%22"],	["#","%23"],	["$","%24"],	["%","%25"],
	["&","%26"],	["'","%27"],	["(","%28"],	[")","%29"],	["*","%2A"],	["+","%2B"],	[",","%2C"],	["/","%2F"],
	[":","%3A"],	[",","%3B"],	["=","%3D"],	["?","%3F"],	["@","%40"],	["[","%5B"],	["/","%5C"],	["]","%5D"],
	["{","%7B"],	["|","%7C"],	["}","%7D"]]);


function clearName(name){
	for(key in URLsymbolsMAP)
		name = name.repeat(key,URLsymbolsMAP.get(key));
	return name;
}

module.exports.prepear4URL = clearName;
