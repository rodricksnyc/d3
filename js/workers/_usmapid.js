self.onmessage = function(event) {
//   self.importScripts('/js/libs/lodash.js', '/js/libs/d3.v4.js');
  self.importScripts('../libs/lodash.js','../libs/d3.v4.js');

  (function load(){
  	var stateList = {},
  			countyList = {}, newId = '', countyEnd = '', stateCode = '';
	d3.queue(2)
    	.defer(d3.json, "../../src/usmap_id.json")
    	.await((error, mapId) => {
    		
    		var setCountyName = function(v){
    			if (v === "02") {
    			        return '';
    			} else if (v === "22") {
    			        return ' Parish'
    			} else {
    			        return ' County';
    			}
    		}

    		var setStateCode = function(v){
    			if(!!stateList && v){
    				var thisCode = stateList[v].split(',')[1];
    				thisCode = (thisCode === "" || thisCode === undefined || thisCode === null) ? '' : thisCode;
    				return thisCode;
    			}else{
    				return false;
    			}
    		}

	    	_.forEach(mapId, (r) => {
	    		if(r && r.id < 57000){
	    			switch ((r.id).toString().length){
	    				case 1:
	    					newId = `0${r.id}`;
	    					stateList[newId] = r.name+' ,'+r.code;
	    				break;
	    				case 2:
							newId = `${r.id}`;
	    					stateList[newId] = r.name+' ,'+r.code;
	    				break;
	    				case 4:
	    					newId = `0${r.id}`;
	    					if(newId.substring(2,5) !== "000"){
	    						countyEnd = setCountyName(newId.substring(0,2));
	    						countyList[newId] = ((r.name).indexOf('city') > -1) ? r.name : r.name + countyEnd;
	    					}
	    				break;
	    				case 5:
	    					newId = `${r.id}`;
	    					if(newId.substring(2,5) !== "000"){
	    						countyEnd = setCountyName(newId.substring(0,2));
	    						countyList[newId] = ((r.name).indexOf('city') > -1) ? r.name : r.name + countyEnd;
	    					}
	    				break;
	    			}
	    		}
	    	});

	    	_.forEach(countyList, (v, k)=>{
	    		if(k && v && Number(k) < 57000){
	    			switch ((k).toString().length){
	    				// case 4:
	    				// 		stateCode = setStateCode(k.substring(0,1));
	    				// 		countyList[k] = v +', '+ stateCode;
	    				// break;
	    				case 5:
	    						stateCode = setStateCode(k.substring(0,2));
	    						countyList[k] = v +', '+ stateCode;
	    				break;
	    			}
	    		}
	    	})
	    	
    	self.postMessage({stateList, countyList});
	  });
  })()
}