const apiURL = 'https://commons.wikimedia.org/w/api.php'; // the url form the Wikimedia Rest api.

// create a new Request object which has all necessary function an objects vor make an request on wikimedia
function Request(query,response,serveradresse,version ){

	// pageParams Container
	var pageParams = {
		limit : 10, // default limit
		offset : 0	// default offset
	};

	var searchKeyword = "";
	var status = 200;

	var res = response;	// respons object

	// container for all filenames which get from wikimedia (unfiltert)
	var filenames = require("./FileNameContainer.js").getFileNameContainer(version);

	// container for all fileinfos form the Filenames in "filenames" which get from wikimedia
	var fileinfos = require("./FileInfoContainer.js").getFileInfoContainer(version);

	//handle filtering
	var filter = require("./ResultFilter.js").getFilter(version);

	// handle host functions
	var linkcreator = require("./LinksCreator.js").getLinkCreator(version);

	// The result object which send as response.
	var result = require("./ResponseObject.js").getResultObject(version);

	// handle request-urls for Wikimedia.
	var createURL = require("./RequestURLCreator.js").getURLCreator(version,apiURL);

	// init form Consturctor
	switch (version){
		case 1 :
			linkcreator.address = serveradresse;
			console.log(query);
			if (query.Q == undefined ) status = 400;
			searchKeyword = encodeURIComponent(query.Q);
			filenames.URLparams.push("srsearch="+searchKeyword);
			for(var element in query){
				if(!(element =="Q" || element == "page" || element == "filter")) {
					status = 400;
					console.log(element);
				}
			}
			var filterQuery = query.filter;
			for( filterParam in filterQuery	){
				filter.count++ ;
				filter.data.push(
					{
						name:filterParam,
						value:filterQuery[filterParam]
					}
				);
			}
			if(query.page){
					result.links.self.meta.limit=pageParams.limit = query.page.limit || pageParams.limit;
					result.links.self.meta.offset = pageParams.offset = query.page.offset || pageParams.offset;
			}
			if (pageParams.limit <= 0 || pageParams.offset < 0) status = 404;
	}

// execute the request and send the response.
	this.execute = function() {
		// create an request-promise
		var rpFiles = require('request-promise');
		rpFiles(createURL.fileList(filenames)).then(function(requestResult){
				return JSON.parse(requestResult);
		}).then(function(resultObject){
			var files = resultObject.query.search;
			for(var index in files){
				filenames.data.push(encodeURIComponent(files[index].title));
			}
			rpFileInfo = require('request-promise')(createURL.fileInfos(filenames,fileinfos)).then(function(requesResult){
				return JSON.parse(requesResult);
			}).then(function(InfosforFiles){
				var InfosforFiles = InfosforFiles.query.pages;
				var cValidObjs = 0;
				for(var index in InfosforFiles){
					var InfoforFile = InfosforFiles[index];
					var outputObj = fileinfos.convert(InfoforFile);
					if ( filter.validate(outputObj) ){
						cValidObjs += 1;
					if (pageParams.offset <= 0 && result.links.self.meta.limit > result.data.length){
						result.links.self.meta.count++;
						result.data.push(outputObj);
					}else
						pageParams.offset--;
					}
				}
				linkcreator.fillLinks(
							result.links.self.meta.limit,
							result.links.self.meta.offset,
							cValidObjs,
							searchKeyword,
							filter,
							result.links);
				if (cValidObjs == 0) status = 404;
				if (status  != 200) result = require("./ResponseObject.js").getErrorResponse(1 , status);
					res.send(JSON.stringify(result));
			}).catch(function(err){
				console.log(err);
				res.send(JSON.stringify(err));
			});
		}).catch(function(err){
			console.log(err);
			res.send(JSON.stringify(err));
		});
			return rpFiles;
	}
	return this;
}

module.exports = {
	getRequest :
		function(query,response,serveradresse,version ){
			return Request(query,response,serveradresse,version );
		}
	};




