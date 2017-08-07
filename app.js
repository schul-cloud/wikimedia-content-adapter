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
app.get("/v1",function(req,res){
	res = res.set('content-type', 'application/vnd.api+json');
   	var fullUrl = req.protocol + '://' + address +":" + port + req.path;
	var wikimedia = require("./wikimedia/Request.js").getRequest(req.query,1,fullUrl,
        function(response){
            if(typeof response === Object) response = JSON.stringify(response);
            res.send(response);
        },function (error , status) {
            res.status(status);
            if(typeof error === Object) error = JSON.stringify(error);
            res.send(error);
        });	// create a new wikimedia-Request
    var accept = !(typeof req.header("accept") == 'undefined');
    accept = accept && !(req.header("accept") == " ");
    accept = accept && !(req.header("accept") == "");
    accept = accept && req.accepts('application/vnd.api+json');
	wikimedia.execute(accept);
});

process.title = "wikimedia";
console.log(process.title);
var server = app.listen(port,address, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)

});
