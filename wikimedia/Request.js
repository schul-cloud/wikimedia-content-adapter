const apiURL = 'https://commons.wikimedia.org/w/api.php'; // the url form the Wikimedia Rest api.

const RequestParams = {
    URLparams : ["action=query","format=json","prop=imageinfo","iiextmetadatalanguage=de"],
    props : ["timestamp","user","url","size","mime","mediatype","dimensions","metadata","commonmetadata","extmetadata"]};
const FileRequestParams = {
    URLparams : ["action=query", "list=search","format=json","srnamespace=6","srqiprofile=classic","srwhat=text","srprop=","srlimit=25"]
};

function isUndefined(object){ return typeof object == 'undefined';  }

function getFileRequestUrl(q) {
    return apiURL+ "?"+ FileRequestParams.URLparams.join("&") + "&srsearch="+q;
}
function getInfoRequestURL(filenames) {
    var props = "iiprop=" + RequestParams.props.join("%7C");
    filenames = "titles=" + filenames.join("%7C");
    return  requestURL = apiURL +"?"+ RequestParams.URLparams.join("&") + "&"+ props + "&" + filenames  ;
}

function getParams(query , params){
    for(var element in query){
        if(!(element ==="Q" || element === "page" || element === "filter")) {
            return 400;
        }
    }
    if (isUndefined(query.Q)) return 400;
    params.q = encodeURIComponent(query.Q);
    if (!isUndefined(query.page)) {
        params.page.limit  = isUndefined(query.page.limit)  ? Number(params.page.limit)  : Number(query.page.limit);
        params.page.offset = isUndefined(query.page.offset) ? Number(params.page.offset) : Number(query.page.offset);
        if (!isUndefined(query.page.limit)  && query.page.limit == '')  return 400;
        if (!isUndefined(query.page.offset) && query.page.offset == '') return 400;
    }
    if ( isNaN(params.page.limit)  || params.page.limit <= 0) return 400;
    if ( isNaN(params.page.offset) || params.page.offset < 0) return 400;

    if (!isUndefined(query.filter)){
        for( filter in query.filter	){
            params.filter.count++ ;
            params.filter.data.push(
                {
                    name:filter,

                    value:query.filter[filter]
                }
            );
        }
    }
    return 200;
}

module.exports.makeRequest = function(query,serveraddress, accept , errCallback ,sendCallback) {
    var errorHandler = require("./ErrorHandler.js");
    var fileList = [];
    var status = 200;
    if (!accept) {
        errCallback(errorHandler.getMessage(406),406);
        return 0;
    }
    var params = {
        q : "",
        page : {
            offset : 0 ,
            limit : 10
        },
        filter : {
            count : 0,
            data : []
        },
        serveraddress : serveraddress
    };
    status = getParams(query,params);
    if (status != 200) {
        errCallback(errorHandler.getMessage(status),status);
        return 0;
    }
    var rpFiles = require('request-promise');
    rpFiles(getFileRequestUrl(params.q)).then(function(requestResult){
        return JSON.parse(requestResult);
    }).then(function(resultObject){
        var files = resultObject.query.search;
        for(var index in files){
            fileList.push(encodeURIComponent(files[index].title));
        }
        rpFileInfo = require('request-promise')(getInfoRequestURL(fileList)).then(function(requesResult){
            return JSON.parse(requesResult);
        }).then(function(InfosforFiles){
            var InfosforFiles = InfosforFiles.query.pages;
            var responseHandler = require("./ResponseHandler.js").getHandler(params);
            for (element in InfosforFiles)
                responseHandler.addData(InfosforFiles[element]);

            if (responseHandler.data.length == 0) {
                errCallback(errorHandler.getMessage(404), 404);
                return 0;
            }
            sendCallback(responseHandler.getResponse());
        }).catch(function(err){
            status = 500;
            errCallback(errorHandler.getMessage(status),status);
            console.error(err);
        });
    }).catch(function(err){
        status = 500;
        errCallback(errorHandler.getMessage(status),status);
        console.error(err);
    });
};




