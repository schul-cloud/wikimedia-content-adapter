function LinksCreator(version){
	switch (version) {
		case 1 : return {
				address : "",
				createRequestAdress : function(limits , offset , searchKeyword , filter){
					if(offset < 0 ) offset = 0;
					var queryTemp = ["q="+searchKeyword];
					for(var filterparam in filter.data){
						queryTemp.push("filter["+ filter.data[filterparam].name +"]="+ filter.data[filterparam].value);
					}
					queryTemp.push("page[limit]="  + limits);
					queryTemp.push("page[offset]=" + offset);
					return this.address +"?"+ queryTemp.join("&");
				},

				fillLinks : function(limit, offset , maxValidObjs, searchKeyword , filter ,links ){
				// Compute Offsets
						var lastOffset = Math.floor(maxValidObjs/limit)*limit
						var nextOffset = ((offset + limit)< lastOffset) ? offset + limit : lastOffset;
						var prevOffset = offset - limit
				// fill the links
						links.first 		= this.createRequestAdress(limit,0,searchKeyword,filter);
						links.self.href 	= this.createRequestAdress(limit,offset,searchKeyword,filter);
						links.prev 			= this.createRequestAdress(limit,prevOffset,searchKeyword,filter);
						links.next 			= this.createRequestAdress(limit,nextOffset,searchKeyword,filter);
						links.last 			= this.createRequestAdress(limit,lastOffset,searchKeyword,filter);


				}

			};
	}
}

module.exports = {
	getLinkCreator : function(version){
		return LinksCreator(version);
	}

}
