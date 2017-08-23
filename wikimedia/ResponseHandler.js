
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

function getDimension(height , width){
    return height + "px" + "X" + width + "px";
}
function getDuration(duration){ // duration in sec
    sec = Math.floor(duration % 60);
    min = duration / 60;
    hour = Math.floor(min / 60);
    min = Math.floor(min % 60);
    result = "" ;
    if (hour) result = result + hour + "h";
    if (min) result = result + min + "m";
    if (sec) result = result + sec + "s";
    if (result !== "") result = "P" +result;
    return result;
}
function getLicense(license , copyrighted){
    var licenseObj = {
        value: "unknow",
        copyrighted : false
    };
    if( license !== undefined)
        licenseObj.value = license.value;

    if( copyrighted !== undefined)
        licenseObj.copyrighted = copyrighted.value === "True";
    return licenseObj;
}

module.exports.getHandler= function(params){

    var Handler = {};
    Handler.data = [];
    Handler.resourceId = 0;
    Handler.offsetCounter = params.page.offset;
    Handler.maxCount = 0;

    Handler.isValid = function(result){
        result = result.attributes;
        var valid = true ;
        for( var i = 0 ; i < this.count; i++){
            var filterObj = this.data[i];
            switch (filterObj.name){
                case "license":
                    var isInLicenses = false;
                    for(var license in result["licenses"]){
                        isInLicenses = isInLicenses || filterObj.value == result.licenses[license].value;
                    }
                    valid = valid && isInLicenses;
                    break;
                case "language" :
                    var isInLanguages = false;
                    for(var language in result["languages"]){
                        isInLanguages = isInLanguages || filterObj.value == result.languages[language];
                    }
                    valid = valid && isInLanguages;
                    break;
                default:
                    valid = valid && result[filterObj.name] == filterObj.value;
                    valid = valid || result[filterObj.name] == undefined;
                    break;
            }
        }
        return valid;
    };


    function getLinkUrl(limit,offset){
        if(offset < 0 ) offset = 0;
        var queryTemp = ["Q="+params.q];
        for(var filterparam in params.filter.data){
            queryTemp.push("filter["+ params.filter.data[filterparam].name +"]="+ params.filter.data[filterparam].value);
        }
        queryTemp.push("page[limit]="  + limit);
        queryTemp.push("page[offset]=" + offset);
        return params.serveraddress +"?"+ queryTemp.join("&");
    }


    Handler.getResponse = function () {
        var result = RequestObject(1);
        result.links.self.meta.count = this.data.length;
        result.links.self.meta.offset = params.page.offset;
        result.links.self.meta.limit = params.page.limit;
        result.data= this.data;
        var lastOffset = Math.floor(this.maxCount/params.page.limit)*params.page.limit
        if (lastOffset == this.maxCount ) lastOffset -= params.page.limit;
        var nextOffset = parseInt(params.page.offset) + parseInt(params.page.limit);
        if (nextOffset > lastOffset) nextOffset = lastOffset;

        var prevOffset = params.page.offset - params.page.limit
        // fill the links
        result.links.first 		= getLinkUrl(params.page.limit,0);
        result.links.self.href 	= getLinkUrl(params.page.limit,params.page.offset);
        result.links.prev 			= (prevOffset >= 0 ) ? getLinkUrl(params.page.limit,prevOffset) : null;
        result.links.next 			= (nextOffset > params.page.offset) ? getLinkUrl(params.page.limit,nextOffset) : null;
        result.links.last 			= (nextOffset > params.page.offset) ? getLinkUrl(params.page.limit,lastOffset) : null;



        return result
    };
    Handler.addData = function(element) {
        var result = RequestDataObject(1);
        result.id = ++this.resourceId;
        result.attributes.title = element.title.replace("File:","");
        result.attributes.url = element.imageinfo[0].url;
        result.attributes.contextUrl = element.imageinfo[0].descriptionurl;
        result.attributes.size =  element.imageinfo[0].size;
        result.attributes.dimensions = getDimension(element.imageinfo[0].height,element.imageinfo[0].width);
        result.attributes.description = "";	// imagediscription
        if(element.imageinfo[0].extmetadata.Credit !== undefined)  // default value (Credit is always in extmetadata)
            result.attributes.description = element.imageinfo[0].extmetadata.Credit.value;
        if(element.imageinfo[0].extmetadata.ImageDescription !== undefined) // if imagediscription exsist discription = that
            result.attributes.description = element.imageinfo[0].extmetadata.ImageDescription.value;
        var duration = getDuration(getDuration(element.imageinfo[0].duration));
        if (duration !=="")
            result.attributes.duration = duration;
        result.attributes.mimeType = element.imageinfo[0].mime;
        result.attributes.licenses.push(getLicense(element.imageinfo[0].extmetadata.License,element.imageinfo[0].extmetadata.Copyrighted));

        if(this.isValid(result)){
            this.maxCount++;
            if( this.data.length < params.page.limit)
                if(this.offsetCounter<= 0)
                    this.data.push(result);
                else
                    this.offsetCounter--;
        }
    };
    return Handler;
};