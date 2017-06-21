
function FileInfos(version){
	switch (version){
		case 1 :
			return {
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
				outputObj.description = "";
				if(InfoforFile.imageinfo[0].extmetadata.Credit != undefined)
					outputObj.description = InfoforFile.imageinfo[0].extmetadata.Credit.value;
				if(InfoforFile.imageinfo[0].extmetadata.ImageDescription != undefined)
					outputObj.description = InfoforFile.imageinfo[0].extmetadata.ImageDescription.value;

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

	}
}

module.exports.getFileInfoContainer = function(version){
	return FileInfos(version);
}
