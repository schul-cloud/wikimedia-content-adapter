var express = require('express');
var app = express();
var wait = require("wait.for");

/*
	this function parse the url GET parameters from the URL
	href = the URL to parsing the parameters.
*/


app.get("/dev/",function(req,res){
   var fullUrl = req.protocol + '://' + req.get('host') + req.path;
	var wikimedia = require("./wikimedia.js").getRequest(req.query,res,fullUrl);
	wikimedia.execute();
});


var server = app.listen(3000,"localhost", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
