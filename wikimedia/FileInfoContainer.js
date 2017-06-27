
function FileInfos(version){

	switch (version){
		case 1 :
			return {
			id_count : 0 ,
			requestURL : "",
			URLparams : ["action=query","format=json","prop=imageinfo","iiextmetadatalanguage=de"],
			props : ["timestamp","user","url","size","mime","mediatype","dimensions","metadata","commonmetadata","extmetadata"],
			data : [],
			// convert the object form wikimedia output in to a schul-cloud api format
			convert : function(InfoforFile){
				var outputObj = require("./ResponseObject.js").getResultDataObject(version);				// init

				outputObj.id = ++this.id_count;
				outputObj.attributes.title = InfoforFile.title.replace("File:","");
				outputObj.attributes.url = InfoforFile.imageinfo[0].url;
				outputObj.attributes.contextUrl = InfoforFile.imageinfo[0].descriptionurl;
				outputObj.attributes.size =  InfoforFile.imageinfo[0].size;
				outputObj.attributes.dimensions = getDimension(InfoforFile.imageinfo[0].height,InfoforFile.imageinfo[0].width)
				outputObj.attributes.description = "";	// imagediscription
				if(InfoforFile.imageinfo[0].extmetadata.Credit != undefined)  // default value (Credit is always in extmetadata)
					outputObj.attributes.description = InfoforFile.imageinfo[0].extmetadata.Credit.value;
				if(InfoforFile.imageinfo[0].extmetadata.ImageDescription != undefined) // if imagediscription exsist discription = that
					outputObj.attributes.description = InfoforFile.imageinfo[0].extmetadata.ImageDescription.value;
				var duration = getDuration(getDuration(InfoforFile.imageinfo[0].duration));
				if (duration !="")
					outputObj.attributes.duration = duration;
				outputObj.attributes.mimeType = InfoforFile.imageinfo[0].mime;
				outputObj.attributes.licenses.push(getLicense(InfoforFile.imageinfo[0].extmetadata.License,InfoforFile.imageinfo[0].extmetadata.Copyrighted));
				return outputObj;
			}
		};

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
	if (result != "") result = "P" +result;
	return result;
}
function getLicense(license , copyrighted){
	var licenseObj = {
		value: "unknow",
		copyrighted : false
	};
	if( license != undefined)
		licenseObj.value = license.value;

	if( copyrighted != undefined)
		licenseObj.copyrighted = copyrighted.value;
	return licenseObj;
}

module.exports.getFileInfoContainer = function(version){
	return FileInfos(version);
}
