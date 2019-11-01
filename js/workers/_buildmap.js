self.onmessage = function(event) {
	self.importScripts('/PIAAC/public/js/libs/lodash.js', '/PIAAC/public/js/libs/d3.v4.js');

debugger;
 //  function buildMap(us){
 //  			    if (error) throw error;

 //  			    var projection = d3.geoAlbersUsa()
 //  			        .scale(1)
 //  			        .fitSize([width, height], topojson.feature(us, us.objects.counties));

 //  			    var path = d3.geoPath()
 //  			        .projection(projection);

 //  			    var main = svg.attr('width', width)
 //  			    .attr('height', height).append('g').attr('transform', 'translate(-40, 0)')

 //  			    main.append("rect")
 //  			        .attr("class", "background")
 //  			        .attr("width", width)
 //  			        .attr("height", height)
 //  			        .style("fill", 'transparent')

 //  		        var g = main.append("g");

 //  			    g.append("g").attr("class", "states").selectAll("path.state")
 //  			        .data(topojson.feature(us, us.objects.states).features)
 //  			      .enter().append("path")
 //  			        .attr('class', 'state')
 //  			        .attr('id', function(d){
 //  			        	return "state"+d.id;
 //  			        })
 //  			        .attr('fill', 'transparent') 
 //  			        .attr("d", path);

	// 	     	g.append("path")
 //  			         .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
 //  			         .attr("class", "mesh")
 //  			      	 .attr("fill", "transparent")
 //  			         .attr("d", path);

 //  			    g.append("path")
 //  			      .datum(topojson.mesh(us, us.objects.land))
 //  			      .attr("class", "nation")
 //  			      .attr("fill", "transparent")
 //  			      .attr("d", path);
 //  }


 //  (function load(){
	// d3.queue()
 //    	.defer(d3.json, "/PIAAC/src/usmap_id.json")
 //    	.await((error, mapId) => {

 //    	self.postMessage({stateList, countyList});
	//   });
 //  })()
}