function URLCreator(version, aApiURL){
	const apiURL = aApiURL;
	switch(version){
		case 1 :
			return 	{
				fileList : function(filenames){
					filenames.requestURL = apiURL +"?"+ filenames.URLparams.join("&");
					return filenames.requestURL;
				},


	 			fileInfos : function(filenames , fileinfos){
					fileinfos.URLparams.push("iiprop=" + fileinfos.props.join("%7C"));
					fileinfos.URLparams.push("titles=" + filenames.data.join("%7C"));
					fileinfos.requestURL = apiURL +"?"+ fileinfos.URLparams.join("&");
					return  fileinfos.requestURL ;
				}
		}
	}
}

module.exports = {
	getURLCreator : function(version,apiURL){
		return URLCreator(version,apiURL);
	}
};
