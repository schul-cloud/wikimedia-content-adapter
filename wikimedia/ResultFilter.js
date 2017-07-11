
function Filter(version){
	switch (version) {
		case 1 :
			return {
				validate : function(resultObject){
					resultObject = resultObject.attributes;
					var valid = true ;
					for( var i = 0 ; i < this.count; i++){
						var filterObj = this.data[i];
						switch (filterObj.name){
							case "license":
								var isInLicenses = false;
								for(var license in resultObject["licenses"]){
									isInLicenses = isInLicenses || filterObj.value == resultObject.licenses[license].value;
								}
								valid = valid && isInLicenses;
								break;
							case "language" :
								var isInLanguages = false;
								for(var language in resultObject["languages"]){
									isInLanguages = isInLanguages || filterObj.value == resultObject.languages[language];
								}
								valid = valid && isInLanguages;
								break;
							default:
								valid = valid && resultObject[filterObj.name] == filterObj.value;
								valid = valid || resultObject[filterObj.name] == undefined;
								break;
						}
					}
					return valid;
				},
				count : 0 ,
				data : []
			};
	}
}

module.exports = {
	getFilter : function(version){
		return Filter(version);
	}
}
