var express = require('express');
var app = express();
var wait = require("wait.for");

/*
	this function parse the url GET parameters from the URL
	href = the URL to parsing the parameters.
*/

var address = "localhost";
var port = 3000;
console.log(process.argv);
if(process.argv.length > 2){
	for(var i = 2 ; i < process.argv.length ; i++){
		switch (process.argv[i]){
		case "-port" :
			port = process.argv[++i];
			break;
		case "-address" :
			address = process.argv[++i];
			break;
		}
	}
}
app.get("/v1/",function(req,res){
   var fullUrl = req.protocol + '://' + req.get('host') + req.path;
	var wikimedia = require("./wikimedia.js").getRequest(req.query,res,fullUrl);
	wikimedia.execute();
});


var server = app.listen(port,address, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
