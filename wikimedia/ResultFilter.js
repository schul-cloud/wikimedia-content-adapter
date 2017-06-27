function Filter(version){
	switch (version) {
		case 1 :
			return {
				validate : function(resultObject){
					var valid = true ;
					for( var i = 0 ; i < this.count; i++){
						switch (this.data[i].name){
							case ("license"):
								valid = valid && resultObject[this.data[i].name].value == this.data[i].value;
								break;
							default:
								valid = valid && resultObject[this.data[i].name] == this.data[i].value;
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
