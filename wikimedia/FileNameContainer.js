function Filenames(version){
	// container for all filenames which get from wikimedia (unfiltert)
	switch (version) {
		case 1:
	//	default :
			return  {
				URLparams : ["action=query", "list=search","format=json","srnamespace=6","srqiprofile=classic","srwhat=text","srprop=","srlimit=25"],
				requestURL : "",
				data : []
			}
	}
}

module.exports = {
	getFileNameContainer :
		function(version){
			return Filenames(version);
		}
}
