var express = require('express');
var app = express();

const apiURL = 'https://commons.wikimedia.org/w/api.php'; // the url form the Wikimedia Rest api.
const fileRegEX = new RegExp("^[\w,\s-]+\.[A-Za-z]{3-4}");
/*
	this function parse the url GET parameters from the URL
	href = the URL to parsing the parameters.
*/
var get_GETParametersFromUrl = function (href) {
	var paramList = require('url').parse(href).query.split("&");
	var returnObject = {};
	paramList.forEach(function(param){
		param = param.split("=");
		returnObject[param[0]] = param[1];
	});
	return returnObject;
}

/*
	this function create the URL for the request to Wikimedia
	search files
	params = GET parameters -> look at getParams
	type 	= type of media to requested (with out any impact)
	result = the result of the hole request for logging the searchparameter and the unknown parameters
*/
var makeWikimediaRequestSEARCH= function(params, result){
	// test reques : /?action=query&format=json&prop=&list=search&meta=&srsearch=Video&srnamespace=6&srlimit=10&srqiprofile=classic&srwhat=text&srprop=
	
	var queryParams = ["action=query", "list=search","format=json","srnamespace=6","srqiprofile=classic","srwhat=text","srprop="];
	for(key in params){
		switch (key) {
		case "query":
			queryParams.push("srsearch="+params[key]);
			result.filters.push({
				name:"query",
				value:params[key]
			} );
			break;
		case "limit":
			queryParams.push("srlimit="+params[key]);
			result.filters.push({
				name:"srlimit",
				value:params[key]
			} );
			break;
		default :
			console.log("unknow parama " + key);
			result.errors.push({
				error:"unknow parama",
				name:key,
				value:params[key]
			})
		}
	}
	return  apiURL +"?"+ queryParams.join("&");
}
;
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

var makeWikimediaRequestFILEINFO= function(files, result){
	// test reques : /w/api.php?/w/api.php?action=query&format=json&prop=imageinfo&list=&meta=&titles=File%3AMuybridge+race+horse+animated+184px.gif%7CFile%3AYBCO+video.webm&iiprop=timestamp%7Cuser%7Curl%7Csize%7Cmime%7Cmediatype%7Cdimensions%7Cmetadata%7Ccommonmetadata
	
	var queryParams = ["action=query","format=json","titles=" + files.join("%7C") ,"prop=imageinfo&"];
	queryParams.push("iiprop=timestamp%7Cuser%7Curl%7Csize%7Cmime%7Cmediatype%7Cdimensions%7Cmetadata%7Ccommonmetadata%7Cextmetadata");
	return  apiURL +"?"+ queryParams.join("&") ;
}


/*
	GET request at root
*/
app.get('/v0-2',function(req, res){
	// reconstruction of the fullUrl
   	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
   	// create an request-promise
       	var rp = require('request-promise');
       	//create the result object
       	var result = {
			filters : [],
			errors : [],
			results : []
		};
	// make the request
	rp(makeWikimediaRequestSEARCH(get_GETParametersFromUrl(fullUrl),result))
  		.then((requestResult) => {
  	  		return JSON.parse(requestResult);
		})
		.then((resultObject) => {
			var files = resultObject.query.search;
			var filenames = [];
			for(var index in files){
		//		if(fileRegEX.test(files[index].title))
					filenames.push(clearName(files[index].title));
			}
			rpFileInfo = require('request-promise')(makeWikimediaRequestFILEINFO(filenames,result))
				.then((requesResult) =>{
					return JSON.parse(requesResult);
				}).then((fileinfos)=>{
					fileinfos = fileinfos.query.pages;
					for(var index in fileinfos){
						var fileinfo = fileinfos[index];
						var outputObj = {};
							outputObj.title = fileinfo.title.replace("File:","");
 							outputObj.url = fileinfo.imageinfo[0].url;
							outputObj.size = {
								value: fileinfo.imageinfo[0].size,
								unit: "byte",
								width: fileinfo.imageinfo[0].width,
								height: fileinfo.imageinfo[0].height
							};
                        	outputObj.duration = fileinfo.imageinfo[0].duration;
                        	outputObj.duration_unit= "sec";
							outputObj.contentCategory = "a";
							outputObj.mimeType = fileinfo.imageinfo[0].mime;
							outputObj.license = {
								value : fileinfo.imageinfo[0].extmetadata.License.value,
								copyrighted : fileinfo.imageinfo[0].extmetadata.Copyrighted.value,
							}
    						result.results.push(outputObj);
							
						}
					res.send(JSON.stringify(result));
					});
						
		})
 		.catch((err) => {
 			console.log(err);
 			result.errors.push(error);
 			res.send(JSON.stringify(result));
		});

});


var server = app.listen(3000,"localhost", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
