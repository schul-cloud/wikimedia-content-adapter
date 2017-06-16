const apiURL = 'https://commons.wikimedia.org/w/api.php'; // the url form the Wikimedia Rest api.

function Request(query,response,serveradresse ){

	var dataContainer = {
	//	result :
	}

	var res = response;
	var filenames = {
		URLparams : ["action=query", "list=search","format=json","srnamespace=6","srqiprofile=classic","srwhat=text","srprop=","srlimit=10"],
		requestURL : "",
		data : []
	}

	var fileinfos = {
		requestURL : "",
		URLparams : ["action=query","format=json","prop=imageinfo&"],
		props : ["timestamp","user","url","size","mime","mediatype","dimensions","metadata","commonmetadata","extmetadata"],
		data : [],
		convert : function(InfoforFile){
			var outputObj = {};
			outputObj.title = InfoforFile.title.replace("File:","");
			outputObj.url = InfoforFile.imageinfo[0].url;
			outputObj.size = {
				value: InfoforFile.imageinfo[0].size,
				unit: "byte",
				width: InfoforFile.imageinfo[0].width,
				height: InfoforFile.imageinfo[0].height
			};
			outputObj.duration = InfoforFile.imageinfo[0].duration;
			outputObj.duration_unit= "sec";
			outputObj.contentCategory = "a";
			outputObj.mimeType = InfoforFile.imageinfo[0].mime;
			outputObj.license = {
				value: "unknow",
				copyrighted : false
			};
			if(InfoforFile.imageinfo[0].extmetadata.License != undefined)
				outputObj.license.value = InfoforFile.imageinfo[0].extmetadata.License.value;

			if(InfoforFile.imageinfo[0].extmetadata.Copyrighted != undefined)
				outputObj.license.copyrighted = InfoforFile.imageinfo[0].extmetadata.Copyrighted.value;
			return outputObj;
		}
	};
	var searchKeyword = "";
	var filter = {
		validate : function(resultObject){
			var valid = true ;
			for( var i = 0 ; i < filter.count; i++){
				switch (filter.data[i].name){
					case ("size"):
					case ("license"):
						valid = valid && resultObject[filter.data[i].name].value == filter.data[i].value;
						break;
					default:
						valid = valid && resultObject[filter.data[i].name] == filter.data[i].value;
						break;
				}
			}
			return valid;
		},
		count : 0 ,
		data : []
	};
	var pageParams = {
		limit : 10,
		offset : 0,
	};

	var host = {
		address : "",
		createRequestAdress : function(limits,offset){
		var queryTemp = ["q="+searchKeyword];
			for(var filterparam in filter.data)
				queryTemp.push("filter["+filterparam.name +"]="+filterparam.value);
			queryTemp.push("page[limit]="  + limits);
			queryTemp.push("page[offset]=" + offset);
			return this.address +"?"+ queryTemp.join("&");
		}
	};
	var result = {
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
	};


	var createURL = {
		fileList : function(){
			filenames.requestURL = apiURL +"?"+ filenames.URLparams.join("&");
			return filenames.requestURL;
		},


	 	fileInfos : function(){
			fileinfos.URLparams.push("iiprop=" + fileinfos.props.join("%7C"));
			fileinfos.URLparams.push("titles=" + filenames.data.join("%7C"));
			fileinfos.requestURL = apiURL +"?"+ fileinfos.URLparams.join("&");
			return  fileinfos.requestURL ;
		}

	};

		host.address = serveradresse;
		filenames.URLparams.push("srsearch="+query.q);
		var filterQuery = query.filter;
		console.log(JSON.stringify(filterQuery));
			for( filterParam in filterQuery	){
			filter.count++ ;
			console.log(filterParam +"\t"+filterQuery[filterParam])
			filter.data.push(
				{
					name:filterParam,
					value:filterQuery[filterParam]
				}
			);
		}
		if(query.page)
				result.links.self.meta.limit=pageParams.limit = query.page.limit || pageParams.limit;
				result.links.self.meta.offset = pageParams.offset = query.page.offset || pageParams.offset;

	this.execute = function(){
		// create an request-promise
		var rpFiles = require('request-promise');

		var start = Date.now();

		rpFiles(createURL.fileList())
			.then((requestResult) => {
				return JSON.parse(requestResult);
			})
			.then((resultObject) => {
				var files = resultObject.query.search;
				for(var index in files){
						filenames.data.push(encodeURIComponent(files[index].title));
				}
					rpFileInfo = require('request-promise')(createURL.fileInfos())
					.then((requesResult) =>{
						return JSON.parse(requesResult);
					}).then((InfosforFiles)=>{
						var InfosforFiles = InfosforFiles.query.pages;
						for(var index in InfosforFiles){
							var InfoforFile = InfosforFiles[index];
							var outputObj = fileinfos.convert(InfoforFile);
								if(filter.validate(outputObj)){
									result.links.self.meta.count++;
									if (pageParams.offset <= 0 && result.links.self.meta.limit > result.data.length){
										result.data.push(outputObj);
									}else
										pageParams.offset--;
								}
							}
						var offset = result.links.self.meta.offset;
						var limit  = result.links.self.meta.limit;
						result.links.first = host.createRequestAdress(limit,0);
						result.links.self.href = host.createRequestAdress(limit,offset);
						offset -=  limit;
						result.links.prev = host.createRequestAdress(limit,offset);
						offset +=  (limit*2);
						result.links.next = host.createRequestAdress(limit,offset);
						result.links.last = host.createRequestAdress(limit,50);

						console.log("request duration = " + (Date.now()- start) + " ms ");
						res.send(JSON.stringify(result));
						})
					.catch((err) => {
						console.log(err);
						res.send(JSON.stringify(err));//JSON.stringify(result));
					});
			})
			.catch((err) => {
				console.log(err);
				res.send(JSON.stringify(err));//result));
			});
			return rpFiles;
		}
		return this;
}

module.exports = {
	getRequest :
		function(query,response,serveradresse ){
			return Request(query,response,serveradresse );
		}
	};




