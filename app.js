var express = require('express');		// the restframework
var app = express();							// create the webapplication

// default value for Address and Port
var address = "localhost";
var port = 3000;

// if necessary parse new port and/or address.
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

// routing for api-v1 : version 1
app.get("/v1/",function(req,res){
	res.set({ 'content-type': 'application/json; charset=utf-8' });
   	var fullUrl = req.protocol + '://' + address +":" + port + req.path;
	var wikimedia = require("./wikimedia/Request.js").getRequest(req.query,res,fullUrl,1);	// create a new wikimedia-Request
	wikimedia.execute();
});


var server = app.listen(port,address, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
