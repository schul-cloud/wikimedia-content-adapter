function Filter(version){
	switch (version) {
		case 1 :
			return {
				validate : function(resultObject){
					var valid = true ;
					for( var i = 0 ; i < this.count; i++){
						switch (filter.data[i].name){
							case ("size"):
							case ("license"):
								valid = valid && resultObject[filter.data[i].name].value == filter.data[i].value;
								break;
							default:
								valid = valid && resultObject[filter.data[i].name] == filter.data[i].value;
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
