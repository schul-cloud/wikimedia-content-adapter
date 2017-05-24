var express = require('express');
var app = express();
//var fs = require("fs");

const apiURL = 'https://commons.wikimedia.org/w/api.php';

var getParams = function getURLParameter(href) {
	var ParamList = require('url').parse(href).query.split("&");
	var ParamsObject = {};
	ParamList.forEach(function(param){
		param = param.split("=");
		ParamsObject[param[0]] = param[1];
	});
	return ParamsObject;
}

var getReQuestURL = function(params, type){
	type = "allimages";
	var queryParams = ["action=query", "list="+ type +"","format=json"];
	for(key in params){
		switch (key) {
		case "query":
			queryParams.push("aifrom="+params[key]);
			break;
		case "limit":
			queryParams.push("ailimit="+params[key]);
			break;
		default :
			console.log("unknow parama " + key);
		}
	}
	return  apiURL +"?"+ queryParams.join("&");
}



app.get('/', function (req, res) {
   	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
       	var rp = require('request-promise');
	rp(getReQuestURL(getParams(fullUrl,"images")))
  		.then((results) => {
  	  		return JSON.parse(results);
		})
		.then((resultObject) => {
			var output = {
				searchparams : [],
				error : [],
				result : []}
			var imageArray = object.query.allimages;
			for(var i = 0; i < imageArray.length; i++) {
 				var obj = imageArray[i];
 				var outputObj = {};
 				outputObj.titel = obj.name;
 				outputObj.url = obj.url;
 				outputObj.type = "image";
    				result.result.push(outputObj);
			}
			res.send(JSON.stringify(result));
		})
 		.catch((err) => console.error(err));


})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
