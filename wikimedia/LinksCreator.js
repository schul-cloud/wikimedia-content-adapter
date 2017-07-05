function LinksCreator(version){
	switch (version) {
		case 1 : return {
				address : "",
				createRequestAdress : function(limits , offset , searchKeyword , filter){
					if(offset < 0 ) offset = 0;
					var queryTemp = ["Q="+searchKeyword];
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
						if (lastOffset == maxValidObjs ) lastOffset -= limit;
						var nextOffset = parseInt(offset) + parseInt(limit);
						if (nextOffset > lastOffset) nextOffset = lastOffset;

						var prevOffset = offset - limit
				// fill the links
						links.first 		= this.createRequestAdress(limit,0,searchKeyword,filter);
						links.self.href 	= this.createRequestAdress(limit,offset,searchKeyword,filter);
						links.prev 			= (prevOffset >= 0 ) ? this.createRequestAdress(limit,prevOffset,searchKeyword,filter) : null;
						links.next 			= (nextOffset > offset) ? this.createRequestAdress(limit,nextOffset,searchKeyword,filter) : null;
						links.last 			= (nextOffset > offset) ? this.createRequestAdress(limit,lastOffset,searchKeyword,filter) : null;


				}

			};
	}
}

module.exports = {
	getLinkCreator : function(version){
		return LinksCreator(version);
	}

}
