var express = require('express');
var app = express();

const apiURL = 'https://commons.wikimedia.org/w/api.php'; // the url form the Wikimedia Rest api.

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
	params = GET parameters -> look at getParams
	type 	= type of media to requested (with out any impact)
	result = the result of the hole request for logging the searchparameter and the unknown parameters
*/
var makeWikimediaRequest = function(params, type, result){
	type = "allimages";
	var queryParams = ["action=query", "list="+ type +"","format=json"];
	for(key in params){
		switch (key) {
		case "query":
			queryParams.push("aifrom="+params[key]);
			result.filters.push({
				name:"query",
				value:params[key]
			} );
			break;
		case "limit":
			queryParams.push("ailimit="+params[key]);
			result.filters.push({
				name:"limit",
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


/*
	GET request at root
*/
app.get('/', function (req, res) {
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
	rp(makeWikimediaRequest(get_GETParametersFromUrl(fullUrl),"images",result))
  		.then((requestResult) => {
  	  		return JSON.parse(requestResult);
		})
		.then((resultObject) => {
			var imageArray = resultObject.query.allimages;
			for(var i = 0; i < imageArray.length; i++) {
 				var obj = imageArray[i];
 				var outputObj = {};
 				outputObj.titel = obj.name;
 				outputObj.url = obj.url;
 				outputObj.type = "image";
    				result.results.push(outputObj);
			}
			res.send(JSON.stringify(result));
		})
 		.catch((err) => {
 			console.log(err);
 			result.errors.push(error);
 			res.send(JSON.stringify(result));
		});
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
