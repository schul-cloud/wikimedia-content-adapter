const apiURL = 'https://commons.wikimedia.org/w/api.php'; // the url form the Wikimedia Rest api.

// create a new Request object which has all necessary function an objects vor make an request on wikimedia
function Request(query,response,serveradresse,version ){

	// pageParams Container
	var pageParams = {
		limit : 10, // default limit
		offset : 0	// default offset
	};

	var searchKeyword = "";

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
			searchKeyword = encodeURIComponent(query.q);
			filenames.URLparams.push("srsearch="+searchKeyword);
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
			if(query.page){
					result.links.self.meta.limit=pageParams.limit = query.page.limit || pageParams.limit;
					result.links.self.meta.offset = pageParams.offset = query.page.offset || pageParams.offset;
			}
	}

// execute the request and send the response.
	this.execute = function(){
		// create an request-promise
		var rpFiles = require('request-promise');

		var start = Date.now();

		rpFiles(createURL.fileList(filenames))
			.then((requestResult) => {
				return JSON.parse(requestResult);
			})
			.then((resultObject) => {
				var files = resultObject.query.search;
				for(var index in files){
						filenames.data.push(encodeURIComponent(files[index].title));
				}
					rpFileInfo = require('request-promise')(createURL.fileInfos(filenames,fileinfos))
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
							var count = result.links.self.meta.count;

						linkcreator.fillLinks(
										result.links.self.meta.limit,
										result.links.self.meta.offset,
										result.links.self.meta.count,
										searchKeyword,
										filter,
										result.links);
						console.log("request duration = " + (Date.now()- start) + " ms ");
						res.send(JSON.stringify(result));
						})
					.catch((err) => {
						console.log(err);
						res.send(JSON.stringify(err));
					});
			})
			.catch((err) => {
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




