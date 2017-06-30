

function RequestDataObject(version){
			switch(version){
				case 1 : return {
					"type": "resource",
					"id": "resource-1",
					"attributes": {
					  "title": "Example Website",
					  "url": "https://example.org",
					  "licenses": [],
					  "mimeType": "text/html",
					  "contentCategory": "a",
      			"languages": ["de"]
			      }
    			}
			}
}


function RequestObject(version){
			switch(version){
				case 1 : return {
				  			"jsonapi":
								{
					 			"version": "1.0",
					 			"meta" :
									{
												"name": "wikimedia-content-adapter",
												"source": "https://github.com/schul-cloud/wikimedia-content-adapter",
												"description": "This is an adpter for media-file search on wikimedia."
					 				}
				  				},
				  			"links":
								{
									"self":
											{
												"href": "http://url.used.to/get/this/document?page[offset]=15&page[limit]=5",
												"meta":
											{
						  						"count": 0,
						  						"offset": 0,
						  						"limit": 10
												}
					 				},
						 			"first": "http://url.used.to/get/this/document?page[offset]=0&page[limit]=5",
									"last": "http://url.used.to/get/this/document?page[offset]=50&page[limit]=5",
						 			"prev": "http://url.used.to/get/this/document?page[offset]=10&page[limit]=5",
						 			"next": "http://url.used.to/get/this/document?page[offset]=20&page[limit]=5"
				  				},
								"data" : []
					}
			}
}


module.exports = {
	getResultObject :
		function(version){
			return RequestObject(version);
		},
	getResultDataObject :
		function(version){
			return RequestDataObject(version);
		}
}
	
