const apiURL = 'https://commons.wikimedia.org/w/api.php'; // the url form the Wikimedia Rest api.

// create a new Request object which has all necessary function an objects vor make an request on wikimedia
function Request(query,version,serveradresse,send,err){

    var isUndefined = function(object){ return typeof object == 'undefined';  }
	// pageParams Container
	var pageParams = {
		limit : 10, // default limit
		offset : 0	// default offset
	};

	var searchKeyword = "";
	var status = 200;
	var sendCallback = send;	// send function as callback            (response)
    var errCallback = err;	    // send function as callback for Errors (response,status)


	// container for  filenames which get from wikimedia (unfiltert)
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
			if (query.Q === undefined ) status = 400;
			searchKeyword = encodeURIComponent(query.Q);
			filenames.URLparams.push("srsearch="+searchKeyword);
			for(var element in query){
				if(!(element ==="Q" || element === "page" || element === "filter")) {
					status = 400;
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
			if(!isUndefined(query.page)){
                result.links.self.meta.limit=pageParams.limit = isUndefined(query.page.limit) ? Number(pageParams.limit): Number(query.page.limit);
                result.links.self.meta.offset = pageParams.offset = isUndefined(query.page.offset) ? Number(pageParams.offset): Number(query.page.offset);
			}

            if ( isNaN(pageParams.limit) || pageParams.limit <= 0) status = 400;
            if ( isNaN(pageParams.offset) || pageParams.offset < 0) status = 400;
	}

// execute the request and send the response.
	this.execute = function(accept) {
		// create an request-promise
        if(!accept){
            status = 406;
        }
        if (status !== 200 ){
            errCallback(require("./ResponseObject.js").getErrorResponse(version,status),status);
            return;
        }
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
				if (cValidObjs === 0) status = 404;
				if (status  === 200) sendCallback(JSON.stringify(result));
				else            	errCallback(require("./ResponseObject.js").getErrorResponse(version , status),status);
			}).catch(function(err){
			    status = 500;
                errCallback(require("./ResponseObject.js").getErrorResponse(version , status),status);
                console.log(err);
			});
		}).catch(function(err){
            status = 500;
            errCallback(require("./ResponseObject.js").getErrorResponse(version , status),status);
            console.log(err);
		});
			return rpFiles;
	};
	return this;
}

module.exports = {
	getRequest :
		function(query,version,serveradresse,send,err){
			return Request(query,version,serveradresse,send,err);
		}
	};




