var express = require('express');		// the restframework
var app = express();							// create the webapplication
const contentType = 'application/vnd.api+json';
// default value for Address and Port
var address = "127.0.0.1";
var port = 3000;

app.set("json spaces","  ");

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
app.get("/v1",function(req,res){
	res = res.set('content-type', contentType);
    var accept = !(typeof req.header("accept") === 'undefined');
    accept = accept && !(req.header("accept") === " ");
    accept = accept && !(req.header("accept") === "");
    accept = accept && req.accepts(contentType) === contentType;
   	var fullUrl = req.protocol + '://' + address +":" + port + req.path;
	require("./wikimedia/Request.js").makeRequest(req.query,fullUrl,accept,
        function (error , status) {
            res.status(status);
            res.json(error);
        },function(response){
            res.json(response);
        });	// create a new wikimedia-Request
});

process.title = "wikimedia";
console.log(process.title);
var server = app.listen(port, function () {
  console.log("Example app listening at http://%s:%s", address, port)
});
