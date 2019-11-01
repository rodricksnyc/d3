"use strict"
function buildMap(w, el, pre, selec){
let svg = d3.select(el),
	width = w,
	height = (w * 0.58),
	colorTeal = ["#B6F2ED","#8FE5E1","#56D6D6","#37AFB5","#319299","#27727A","#22686B"],
	colorBlue = ["#b3e8ff", "#80d9fe", "#4dc9fe", "#1bbafe", "#01a1e4", "#017db2", "#01597f"],
	colorGreen = ["#CCF8D8","#9EDBB1","#79C693","#6AA87D","#569065","#387148","#15481D"],
	currentDataSet = 1,
	color,
	lnt = {
		selection: false,
		currentVal : {
			L1 : 'At or Below Level 1 Literacy',
			L2 : 'At Level 2 Literacy',
			L3 : 'At or Above Level 3 Literacy',
			LA : 'Average Literacy',
			N1 : 'At or Below Level 1 Numeracy',
			N2 : 'At Level 2 Numeracy',
			N3 : 'At or Above Level 3 Numeracy',
			NA : 'Average Numeracy'
		},
	},
	max,
	min,
	showState = false,
	prevIteration, stop,
    tooltip = d3.select("#mapTooltip")
    .style("opacity", 0),
   	mt_h = d3.selectAll('.mt_h'),
   	mt_v_v1 = d3.selectAll('.mt_v_v1'),
   	mt_v_v2 = d3.selectAll('.mt_v_v2'),
   	mt_v_v3 = d3.selectAll('.mt_v_v3'),
   	mt_l = d3.select('.mt_l'),
	filterData = function(n){
		return (Number(n) * 100).toString().substring(0,2).replace('.','');
	},
	d3Container = {
	setAttributes : () => {
			let tooltipWidth = !$('.mapContainer').width() ? 960 : $('.mapContainer').width();
			
			let tooltipHeight = ((tooltipWidth/8)*5 < 600) ? 600 : (((tooltipWidth/8)*5 > 800) ? 800 : 650);

			const _md = 992;
			const _lg = 1200;
			const _xl = 1600;

			let scaleCalc = (tooltipWidth > _md && tooltipWidth < _lg) ? 1 : (tooltipWidth < _md ? tooltipWidth/_md : ((tooltipWidth > _lg && tooltipWidth < _xl) ? tooltipWidth/_lg : (tooltipWidth > _xl ? 1.33 : 1)));
			return 1;
	},
	setMax : function(){
				max = d3.max($PIAAC['$NOWSHOWING'].values(), function(d) { return +d;} );
				min = d3.min($PIAAC['$NOWSHOWING'].values(), function(d) { return +d;} );

				min = min < 0 ? 0 : min;
				var thisColor = d3.scaleQuantile()
				    .domain(d3.range(min,max,(max-min)/10))
				  	.range(lnt.selection ? colorGreen : d3.schemeBlues[9]);
				  	color = thisColor;
	},          
	queue : (c) => {
					d3.queue(2)
	    				.defer(d3.json, "./src/usmap2.json")
					    .await((error, us) => {
					    	_.forEach($PIAAC['$LANDINGPAGEDATA'], (r) => {
					    		$PIAAC['$NOWSHOWING'].set(r.ID, +r[c]);
					    		$PIAAC['$NOWSHOWINGCV'].set(r.ID, +r[c+'-CV']);
							});
					    	d3Container.build(error, us);
				    });
	},
	colorFill : (d) => {
		let appendingPathData = showState && (Number(d.id) < 100) ? $PIAAC.$USSTATEID[d.id] : $PIAAC.$USCOUNTYID[d.id];
		if(!appendingPathData){ return "#ffffff"};
		showState ?  '' : d.countyValue = $PIAAC['$NOWSHOWING'].get(`C${Number(d.id)}`);
		showState ? '' : d.countyCV = $PIAAC['$NOWSHOWINGCV'].get(`C${Number(d.id)}`);
		d.name = appendingPathData;
		d.stateValue = $PIAAC['$NOWSHOWING'].get(appendingPathData.split(',')[1].trimStart());
		d.stateCV = $PIAAC['$NOWSHOWINGCV'].get(appendingPathData.split(',')[1].trimStart());
		return color(showState ? d.stateValue : d.countyValue);
	},
	stateColorFill : (d) => {
			      	let appendingPathData = d.id < 100 ? $PIAAC.$USSTATEID[d.id] : $PIAAC.$USCOUNTYID[d.id];
			      	if(!appendingPathData){ return "#ffffff"};
			      	d.name = appendingPathData;
			      	d.stateValue = $PIAAC['$NOWSHOWING'].get(appendingPathData.split(',')[1].trimStart());
					d.stateCV = $PIAAC['$NOWSHOWINGCV'].get(appendingPathData.split(',')[1].trimStart());
		      		return color(d.stateValue);
	},
	build : function(error, us){
				    if (error) throw error;
				    this.setMax();
				    var active = d3.select(null);
				    var projection = d3.geoAlbersUsa()
				        .scale(1)
				        .fitSize([width, height], topojson.feature(us, us.objects.counties));

				    var zoom = d3.zoom()
				        .scaleExtent([1, 40])
				        .on("zoom", zoomed);

				    var path = d3.geoPath()
				        .projection(d3.geoIdentity().scale(1).fitSize([width, height], topojson.feature(us, us.objects.counties)));

				    var main = svg.attr('width', width)
				    .attr('height', height + 10).append('g').attr('transform', 'translate(-40, 10)').on("click", stopped, true);

	            	let addfilter = svg.append("defs");

		              let filter_0 = addfilter.append("filter")
		                  .attr("id", "dropshadow")

		              filter_0.append("feGaussianBlur")
		                  .attr("in", "SourceAlpha")
		                  .attr("stdDeviation", 2)
		                  .attr("result", "blur");
		              filter_0.append("feOffset")
		                  .attr("in", "blur")
		                  .attr("dx", 2)
		                  .attr("dy", 2)
		                  .attr("result", "offsetBlur");

		              let feMerge_0 = filter_0.append("feMerge");

		              feMerge_0.append("feMergeNode")
		                  .attr("in", "offsetBlur")
		              feMerge_0.append("feMergeNode")
		                  .attr("in", "SourceGraphic");

				    main.append("rect")
				        .attr("class", "background")
				        .attr("width", width)
				        .attr("height", height)
				        .style("fill", 'transparent')
				        .on("click", reset);

			        main.call(zoom);
			        var g = main.append("g");

				    var state = g.append("g").attr("class", "states").selectAll("g.state")
				        .data(topojson.feature(us, us.objects.states).features)
				      .enter().append("g").attr('class', 'state');

				        state.append('path').attr('id', function(d){
				        	return "state"+d.id;
				        })
				      	.attr("fill", d3Container.colorFill)
				        .attr("d", path)

						// state.append("text")
		    //         	.text((d)=>{
		    //         		var result;
		    //         		if(d.id < 57){
		    //         			result = $PIAAC.$USSTATEID[d.id].split(' ,')[0];
		    //         		}else{
		    //         			result = 0
		    //         		}
		    //         	 	return result;
		    //         	 })
		    //             .attr('id', function(d){
				  //       	return "stateName"+d.id;
				  //       })
						// .style("text-anchor", "middle")
						// .attr("x", function(d){ if(d.id < 57) return path.centroid(d)[0]})
						// .attr("y", function(d) { if(d.id < 57) return path.centroid(d)[1];})
		    //             .style("fill", "#aaa")
		    //             .style("font-size", '10px')
		    //             .style("font-weight", 400)
		    //             .style('opacity', 0);	
					     // .on("click", clicked);

				    g.append("g")
				      .attr("class", "counties")
				      .selectAll("path.county")
				      .data(topojson.feature(us, us.objects.counties).features)
				      .enter().append("path").attr("class", function(d){
				      	var $this = (d.id).toString().substring(0,2);
				      	return `county state${$this} county_${d.id}`;
				      })
				      .attr("fill", d3Container.colorFill)
				      .attr("d", path)
					     .on("mouseover", function(d) {
					       tooltip.transition()
					         .duration(200)
					         .style("opacity", 1);
					       tooltip.style("left", (d3.event.pageX - 100) + "px")
					         .style("top", (d3.event.pageY - 150) + "px");
					        mt_h.html('<i class="far fa-balance-scale"></i>'+d.name);
					        mt_v_v1.html(d.countyValue > 1 ? (d.countyValue).toString().substring(0,3) : filterData(d.countyValue)+"%");
					        mt_v_v2.html(d.stateValue > 1 ? (d.stateValue).toString().substring(0,3) : filterData(d.stateValue)+"%")
					        mt_v_v3.html(d.stateValue > 1 ? ($PIAAC['$NOWSHOWING'].get(`Nation`)).toString().substring(0,3) : filterData($PIAAC['$NOWSHOWING'].get(`Nation`))+"%");
					       })
					     .on("mouseout", function(d) {
					       tooltip.transition()
					         .duration(500)
					         .style("opacity", 0);
					       })
					    //  .on("click", clicked);

				    g.append("path")
				         .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
				         .attr("class", "mesh")
				      	 .attr("fill", "transparent")
				         .attr("d", path);

				    g.append("path")
				      .datum(topojson.mesh(us, us.objects.nation))
				      .attr("class", "nation")
				      .attr("fill", "transparent")
				      .attr("d", path);


				      function clicked(d) {
						var $this = (d.id).toString().substring(0,2);
				      	var $thisNode = 'path#state'+$this,
				      	$selectedNode = d3.select($thisNode);

				        if (active.node() === $thisNode) return reset();
				        active.classed("active", false);
				        active = $selectedNode.classed("active", true);
				        // d3.selectAll('.states g text').style('opacity', 0)
				        // d3.select('text#stateName'+$this).style('opacity', 1)
				        var bounds = path.bounds($selectedNode.node().__data__);
				        var dx = bounds[1][0] - bounds[0][0],
				            dy = bounds[1][1] - bounds[0][1],
				            x = (bounds[0][0] + bounds[1][0]) / 2,
				            y = (bounds[0][1] + bounds[1][1]) / 2,
				            scale = Math.max(1, Math.min(4, 0.9 / Math.max(dx / width, dy / height))),
				            translate = [width / 2 - scale * x, height / 2 - scale * y];

				        d3.selectAll('svg .mesh, svg .nation').style('stroke-width', '0.5px');
				       	d3.selectAll('.counties').style('stroke', 'rgba(0,0,0,0.2)') 
				        main.transition()
				            .duration(750)
				            .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
					  }

				      function reset() {
				        active.classed("active", false);
				        active = d3.select(null);

				         d3.selectAll('svg .mesh, svg .nation').style('stroke-width', '0.5px');
				        	d3.selectAll('.counties').style('stroke', 'rgba(0,0,0,0.5)') 
				        
				        main.transition()
				            .duration(750)
				            .call( zoom.transform, d3.zoomIdentity );
				      }

				      function zoomed() {
				        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
				        g.attr("transform", d3.event.transform);
				      }

				      function stopped() {
				        if (d3.event.defaultPrevented) d3.event.stopPropagation();
				      }

				      $('.mapHeader').show();
				      $('.mapLoaderBlue').hide().removeClass('delay-1s');
				      $('#mapLegend').show();
					  $('.mapContainer').addClass('zoomInSlow');
					  

					  $('.legendMinValue').text(`${Math.round(min*100)}%`);
					  $('.legendMaxValue').text(`${Math.round(max*100)}%`);
					  $$defaultMapLoaded = true;
	},
	dataUpdate: function(c){
		    	$('.mapContainer').addClass('loading').removeClass('zoomInSlow');
		    	$('.mapHeader').removeClass('fadeInDown').addClass('fadeOutUp');
				lnt.selection = c.indexOf('L') !== -1 ? false : true;
				$('.mt_l').html(`${lnt.currentVal[c]}`);
			    if(lnt.selection){
			    	$('#mapTooltip, .mf-ls, .legendColorRange').addClass('Numeracy');
			    	$('.mf-ls--radio-label, .legendTitle').removeClass('t-navyblue').addClass('t-darkgreen');
			    	$('.mapLoaderGreen').show();
			    }else{
			    	$('#mapTooltip, .mf-ls, .legendColorRange').removeClass('Numeracy');
			    	$('.mf-ls--radio-label, .legendTitle').addClass('t-navyblue').removeClass('t-darkgreen');
			    	$('.mapLoaderBlue').show();
			    }
				let self = this;

				function fillColor(){
			    	self.setMax();
			    	
			    	if(c === "NA" || c === "LA"){
			    		$('.legendMinValue').text(`${Math.round(min)}`);
			    		$('.legendMaxValue').text(`${Math.round(max)}`);
			    		$('.legendTitle').text('Average proficiency')
			    	}else{
			    		$('.legendMinValue').text(`${Math.round(min*100)}%`);
			    		$('.legendMaxValue').text(`${Math.round(max*100)}%`);
			    		$('.legendTitle').text('Proficiency percentage')
			    	}

					d3.select('g.counties')
			    		 .selectAll('path')
			    		 .transition()
			    		 .ease(d3.easeLinear) 
			    		 .duration(600)
			    		 .attr("fill", d3Container.colorFill);

					d3.select('g.states')
			    		 .selectAll('path')
			    		 .transition()
			    		 .ease(d3.easeLinear) 
			    		 .duration(600)
			    		 .attr("fill", d3Container.colorFill);

	    		 	setTimeout(function(){
				    	if(c === "NA" || c === "LA"){
							$('.mapHeader').html(`Map of ${lnt.currentVal[c]}`).css({color: lnt.selection ? '#387148' : '#08669B', left: 'calc(50% - 90px)'});
				    	}else{
				    		$('.mapHeader').html(`Map of percentage ${lnt.currentVal[c]}`).css({color: lnt.selection ? '#387148' : '#08669B', left: 'calc(50% - 190px)'});
				    	}
	    		 	$('.mapLoaderBlue, .mapLoaderGreen').hide();
	    		 	$('.mapContainer').removeClass('loading').addClass('zoomInSlow'); $('.mapHeader').addClass('fadeInDown').removeClass('fadeOutUp');;
	    		 	}, 1000)
				}
			  	Promise.all(_.forEach($PIAAC['$LANDINGPAGEDATA'], (r) => {
					$PIAAC['$NOWSHOWING'].set(r.ID, +r[c]);
					$PIAAC['$NOWSHOWINGCV'].set(r.ID, +r[c+'-CV']);
				})).then(result => {
					setTimeout(function(){fillColor()}, 1000)
			  	}).then(()=>{
			  		setTimeout(function(){preciseCheckFn()}, 1500)
			  	});

	},
	dataFilter: function(Arr){
		function getEstimates(v){
			if(v >= 0 && v <= 0.3){
				return 1;
			}else if(v > 0.3 && v <= 0.5){
				return 2;
			}else if(v > 0.5 && v <= 1){
				return 3;
			}else{
				return 0;
			}
		}

		d3.selectAll('path.county').style('fill', function(d){
			let bucket = getEstimates(d.countyCV), result;
			if(Arr[0] == true){
				result = '';
			}else{
				if(Arr[bucket] == true){
					result = '';
				}else{
					result = 'transparent';
				}
			}
			return result;
		});

		d3.selectAll('g.state path').style('fill', function(d){
			let bucket = getEstimates(d.stateCV), result;
			if(Arr[0] == true){
				result = '';
			}else{
				result = Arr[bucket] ? '' : 'transparent';	
			}
			return result;
		});
	},
	showHideStateMap: function(Bool){
		if(Bool){
			showState = true;
			$('g.counties').hide();
			d3.select('g.states')
    		 .selectAll('path')
     		 .on("mouseover", function(d) {
    		   tooltip.transition()
    		     .duration(200)
    		     .style("opacity", 1);
    		   tooltip.style("left", (d3.event.pageX - 100) + "px")
    		     .style("top", (d3.event.pageY - 150) + "px");
    		    mt_h.html('<i class="far fa-balance-scale"></i>'+(d.name).split(',')[0]);
    		    $('.mt_v_v1').parent().hide();
		        mt_v_v2.html(d.stateValue > 1 ? (d.stateValue).toString().substring(0,3) : filterData(d.stateValue)+"%")
		        mt_v_v3.html(d.stateValue > 1 ? ($PIAAC['$NOWSHOWING'].get(`Nation`)).toString().substring(0,3) : filterData($PIAAC['$NOWSHOWING'].get(`Nation`))+"%");
    		   })
    		 .on("mouseout", function(d) {
    		   tooltip.transition()
    		     .duration(500)
    		     .style("opacity", 0);
    		   })
    		 .attr("fill", d3Container.colorFill);
    		 $('.mf_search').attr('placeholder', 'Find states')
    		 $('.mf_ddList--ul.state').show();
    		 $('.mf_ddList--ul.county').hide();
		}else{
			showState = false;
			$('g.counties').show();
		 	$('.mt_v_v1').parent().show();
			d3.select('g.states')
    		 .selectAll('path')
    		 .transition()
    		 .ease(d3.easeLinear) 
    		 .duration(600)
    		 .attr("fill", 'transparent');
			d3.select('g.counties')
    		 .selectAll('path')
    		 .transition()
    		 .ease(d3.easeLinear) 
    		 .duration(600)
    		 .attr("fill", d3Container.colorFill);
    		 $('.mf_search').attr('placeholder', 'Find counties')
     		 $('.mf_ddList--ul.state').hide();
    		 $('.mf_ddList--ul.county').show();
		}
		preciseCheckFn();
	}
}

let getData = (init) => {
	let $sel = $("input[name='levelselector']:checked").val();
	init ? d3Container.queue($sel) : d3Container.dataUpdate($sel);
}

getData(true);
window.addEventListener('resize', d3Container.setAttributes);

	$('input[name="levelselector"]').each(function(){
	  $(this).change(function(){
	  		getData(false)
	  })
	});

	$('.mf_lnt button').on('click',function(e){
	  	if(!$(this).hasClass('active')){
	  		$('.mf-ls--radio-input').each(function(e){
	  			let $val = $(this).val();
	  			if($val.indexOf('L') !== -1){
	  				$val = $val.replace('L', 'N')
	  			}else{
	  				$val = $val.replace('N', 'L')
	  			}
	  			$(this).val($val);
	  		});
	  		$('.mf-ls .fas').each(function(e){
	  			let $val = $(this).attr('data-attached');
	  			if($val.indexOf('L') !== -1){
	  				$(this).attr('data-attached', $val.replace('L', 'N'))
	  			}else{
	  				$(this).attr('data-attached', $val.replace('N', 'L'))
	  			}
	  		})
	  		getData(false)
	  	}
	});


	$('.mf_cst button').on('click', function(e){
		if(!$(this).hasClass('active')){
			d3Container.showHideStateMap($(this).text() === "State" ? true : false);
		}
	})

// Select Estimates Checkbox style

	function preciseCheckFn(){
	  let preciseCheckArr = [true, false, false, false];
	    $('.mf_se--main input[type="checkbox"]').each(function(i,e){
	         if($(this).is(":checked")){
	           preciseCheckArr[i] = true;
	         }else{
	           preciseCheckArr[i] = false;
	         }
	    });
	    d3Container.dataFilter(preciseCheckArr);
	}

	(function selectEstimateStyle(){
		$('.mf_se--main input[type="checkbox"]').each(function(i,e){
		  var index = i;
		  $(this).change(function(){
		    if($('input[type="checkbox"]:checked').length < 1){
		      $('#checkbox_0').prop('checked', true);
		      $($('#checkbox_1').parent()).removeClass('active');
		      $($('#checkbox_2').parent()).removeClass('active');
		      $($('#checkbox_3').parent()).removeClass('active');
		      $($('#checkbox_0').parent()).addClass('active');
		    }else if(index !== 0 && $(this).is(':checked')){
		      $('#checkbox_0').prop('checked', false);
		      $($('#checkbox_0').parent()).removeClass('active');
		      $($(this).parent()).toggleClass('active');
		    }else if(index === 0 && $(this).is(':checked')){
		      $('#checkbox_1, #checkbox_2, #checkbox_3').prop('checked', false);
		      $($('#checkbox_1').parent()).removeClass('active');
		      $($('#checkbox_2').parent()).removeClass('active');
		      $($('#checkbox_3').parent()).removeClass('active');
		      $($(this).parent()).addClass('active');
		    }else{
		      $($(this).parent()).toggleClass('active');
		    }
		    preciseCheckFn();
		  })
		})
	})();

	function filterdd(t, l, e) {
	        let v = $(t).val() || "",
	                s = 0;
	        if(v === "" || v === null){
	          return false
	        }else{
	          $(l).each(function(e, i) {
	                  if (v !== "" || v !== undefined) {
                              var $sel = showState ? `#state${$(i).attr("data-value")}` : `.county_${$(i).attr("data-value")}`;
	                          if (i.innerHTML.toLowerCase().indexOf(v.toLowerCase()) > -1) {
	                                  $(i).show();
	                                  d3.select($sel).style('fill', d3Container.colorFill).attr('filter', v.length > 1 ? 'url(#dropshadow)' : 'unset');
	                                  $(i).on('click', function(){
	                                  	d3.select($sel).dispatch('click');
	                                  })
	                                  s--;
	                          } else {
	                                  $(i).hide();
	                                  d3.select($sel).style('fill', 'transparent').attr('filter', 'unset');
	                                  s++;
	                          }
	                  } else {
	                          $(i).show();
	                  }
	          });
	          if(s === $(l).length){
	            $(`${e} ul span.noresult`).show();
	          }else{
	            $(`${e} ul span.noresult`).hide();
	          }
	          return true;
	        } 
	}

	$('.mf_search').on("input", function(e) {
	        if(filterdd(this, showState ? `.mf_ddList--ul.state li` : `.mf_ddList--ul.county li`, `.${$(this).attr('data-attached')}`)){
	          $('.mf_ddList').show();
	        }else{
	          $('.mf_ddList').hide();
              showState ? d3.select(`g.states`).selectAll('path').style('fill', d3Container.colorFill).attr('filter', 'unset') : d3.select(`g.counties`).selectAll('path').style('fill', d3Container.colorFill).attr('filter', 'unset');
              $('#checkbox_0').prop('checked', true);
              $('#checkbox_1').prop('checked', false);
              $('#checkbox_2').prop('checked', false);
              $('#checkbox_3').prop('checked', false);
		      $($('#checkbox_1').parent()).removeClass('active');
		      $($('#checkbox_2').parent()).removeClass('active');
		      $($('#checkbox_3').parent()).removeClass('active');
		      $($('#checkbox_0').parent()).addClass('active');
	        }
	});
}


	// dataUpdate : (t, prev, check) => {
	// 			if (stop == true) {return};
	// 			setTimeout(() => {		

	// 				// .CSV load time is relatively high. 		
	// 				// d3.queue(1)
	// 				//     .defer(d3.csv, "./src/mcmc.csv", (d) => { objEstimateVal.set(d.Name, +d[currentDataSet.toString()]); })
	// 				//     .await(() => { d3.select('g.counties')
	// 				// 		    		 .selectAll('path')
	// 				// 		    		 .transition()
	// 				// 		    		 .ease(d3.easeLinear) 
	// 				// 		    		 .duration(t/2)
	// 				// 		    		 .attr("fill", d3Container.colorFill)});

	// 		    	_.forEach(csv, (r) => {
	// 		    		objEstimateVal.set(r.Name, +r[currentDataSet.toString()]);
	// 		    	})

	// 		    	   d3.select('g.counties')
	// 		    		 .selectAll('path')
	// 		    		 .transition()
	// 		    		 .ease(d3.easeLinear) 
	// 		    		 .duration(t/2)
	// 		    		 .attr("fill", d3Container.colorFill);

 //        			document.getElementById('test1').innerHTML = "Currently showing data set = <b style='font-size: 16px;filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2));'>"+currentDataSet+"</b>";
 //    				if(currentDataSet < 30){d3Container.dataUpdate((Number($('.range-labels li.active.selected').index()) + 1)*500)}else{ $('.btnPause').hide(); $('.btnPlay').show(); d3Container.setCurrent(); return;};
	// 				$('p#test1').css({"borderImage": 'linear-gradient(to right, #37adbf 0%, #37adbf ' + currentDataSet*3.5 + '%, #b2b2b2 ' + currentDataSet*3.5 + '%, #b2b2b2 100%)'});
 //    				currentDataSet++;
 //    			}, t);
	// },
	// setCurrent : () => {
	// 			setTimeout(()=>{
	// 				currentDataSet = 1;
	// 			},5100)
	// } 
// d3Container.dataUpdate(2000)




























