"use strict"

var $PIAAC = {
	$NOWSHOWING : d3.map(),
	$NOWSHOWINGCV: d3.map(),
	$INFO : {
		L1 : 'Below 226 points. The most basic tasks at this level require the respondent to read brief texts on familiar topics and locate a single piece of specific information. There is seldom any competing information in the text. Only basic vocabulary knowledge is required, and the reader is not required to understand the structure of sentences or paragraphs or make use of other text features. The more challenging tasks at this level require the respondent to read relatively short digital or print texts to locate a single piece of information that is identical to or synonymous with the information given in the question or directive. Knowledge and skill in recognizing basic vocabulary, determining the meaning of sentences, and reading paragraphs of text is expected.',
		L2 : '226 to less than 276 points. Tasks at this level require the respondent to make matches between the text, either digital or printed, and information, and may require paraphrasing or low-level inferences',
		L3 : '276 or more. The most basic texts at this level are often dense or lengthy. Understanding text and rhetorical structures is often required, as is navigating complex digital texts. The most challenging texts at this level may require the respondent to search for and integrate information across multiple, dense texts; construct syntheses of similar and contrasting ideas or points of view; or evaluate evidence based arguments. They often require respondents to be aware of subtle, rhetorical cues and to make high level inferences or use specialized background knowledge.',
		N1 : 'Below 226 points. The most basic tasks at this level require the respondent to carry out simple processes such as counting, sorting, performing basic arithmetic operations with whole numbers or money, or recognizing common spatial representations. The more challenging tasks at this level require the respondent to carry out basic mathematical processes in common, concrete contexts where the mathematical content is explicit. Tasks usually require one-step or simple processes involving counting; sorting; performing basic arithmetic operations; and identifying elements of simple or common graphical or spatial representations.',
		N2 : '226 to less than 276 points. Tasks at this level require the application of two or more steps or processes involving calculation with whole numbers and common decimals, percents and fractions; simple measurement and spatial representation; estimation; and interpretation of relatively simple data and statistics in texts, tables and graphs.',
		N3 : '276 or more. The most basic texts at this level require the application of number sense and spatial sense; recognizing and working with mathematical relationships, patterns, and proportions expressed in verbal or numerical form; and interpreting data and statistics in texts, tables and graphs. The most challenging texts at this level may require the respondent to integrate multiple types of mathematical information where considerable translation or interpretation is required; draw inferences; develop or work with mathematical arguments or models; and critically reflect on solutions or choices.',
		PL : 'The coefficient of variation (CV) is equal to 100% multiplied by the root mean square error divided by the estimate. The levels of precision follow the NCES guidelines. Precise estimates have CVs less than 30%. Moderately precise estimates have CVs between 30% and 50%. Imprecise estimates have CVs greater than 50%.'
	}
},
workerForUsMapId = new Worker('js/workers/_usmapid.js'),
$$defaultMapLoaded = false,

loadingVal = 0;

$(document).ready(function(){
	$('#landingpage_container').css({ height : `${window.innerHeight-104}px`});

	var i = d3.select('#loadingVal').append("text").text(function() {
	    return loadingVal + "%"
	});

	var loading = function loadingStatus(prevVal, Val){
	        var r = d3.format(",d");
	        i.transition().ease(d3.easeLinear).duration(800).tween("text", function() {
	            var t = d3.select(this)
	              , e = d3.interpolateNumber(prevVal, Val);
	            return function(a) {
	                t.text(r(e(a)) + "%")
	            }
	        })
	}

	loading(0, 68);

	setTimeout(function(){
		workerForUsMapId.postMessage($PIAAC);
	}, 500)

	workerForUsMapId.onmessage = function(event){
		debugger;
		$PIAAC['$USCOUNTYID'] = event.data.countyList;
		$PIAAC['$USSTATEID'] = event.data.stateList;
		$PIAAC['$LANDINGPAGEDATA'] = event.data.landingPageData;
		startBuilding();
	};

	workerForUsMapId.onerror = function(event) {
	    console.error('error received from workerFor => ', event);
	};

	function getLocation() {
		  if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(showPosition);
		  } else { 
		    
		  }
		}

		function showPosition(position) {
			countyLookUp(position.coords.latitude,position.coords.longitude);
		}



	function startBuilding(){
		Promise.resolve(
				loadMapFilter(),
			).then(()=>{

	 	 		_.forEach($PIAAC['$USCOUNTYID'], (v, k)=>{
		 	 	  $('.mf_ddList--ul.county').append(`<li data-value=${k}>${v}</li>`)
		 	 	})

		 	 	_.forEach($PIAAC['$USSTATEID'], (v, k)=>{
		 	 	  $('.mf_ddList--ul.state').append(`<li data-value=${k}>${v}</li>`)
		 	 	})

	 	 	}).then(()=>{
	 	 		loading(68, 100);
	 			$('.loader--init_svg, .loader--init p').addClass('animated zoomOut delay-1s');
	 			$('.loader--init').addClass('animated fadeOut delay-1s');
	 			$('.mapLoaderBlue').show().addClass('delay-1s');
				$('.filter, .mapControlsList').show();
				$('.container-fluid').toggleClass('dom-not-ready');
				$('.intro').show();
	 			setTimeout(function(){
	 				getSize();
	 				// getLocation();
	 			}, 2000)
	 	 	})
	 	 }

 	 $('.intro-close, .close-btn').on('click', function(){
		$('.intro').removeClass('delay-1s').addClass('fadeOut');
		$('.intro-wrapper').removeClass('delay-1s').addClass('fadeOutUp');
		setTimeout(function(){
			$('.intro').hide();
		}, 1200)
 	 })

 	 $('.fas').hover(function(e){
 	 	let $val = $(this).attr('data-attached');
 	 	if($val === "L1"){
 			$('.info-tooltip').css({left: '64px', top: `48px`})
 	 	}
 	 	if($val === "N1"){
 	 		$('.info-tooltip').css({left: '64px', top: `96px`})	
 	 	}
 	 	if($val === "L2"){
 			$('.info-tooltip').css({left: '64px', top: `292px`})
 	 	}
 	 	if($val === "N2"){
 	 		$('.info-tooltip').css({left: '64px', top: `240px`})	
 	 	}
 	 	if($val === "L3"){
 			$('.info-tooltip').css({left: '64px', top: `196px`})
 	 	}
 	 	if($val === "N3"){
 	 		$('.info-tooltip').css({left: '64px', top: `180px`})
 	 	}
 	 	if($val === "PL"){
 	 		$('.info-tooltip').css({left: '64px', top: `40px`})
 	 	}
		$('.info-tooltip').css({opacity: 1, visibility: 'visible'});
		$('.info-tooltip p').text($PIAAC.$INFO[$val]);
 	 }, function(){
 	 	$('.info-tooltip').css({opacity: 0, visibility: 'hidden'});
 	 })

// window.onbeforeunload = function (e) {
//     e = e || window.event;

//     // For IE and Firefox prior to version 4
//     if (e) {
//         e.returnValue = 'Sure?';
//     }

//     // For Safari
//     return 'Sure?';
// };
    // function ipLookUp (p) {
    // 	debugger;
    //       $.ajax('http://ip-api.com/json')
    //       .then(
    //           function success(response) {
    //           	countyLookUp(response.lat,response.lon);
    //           },

    //           function fail(data, status) {
    //               console.log('Request failed.  Returned status of',
    //                           status);
    //           }
    //       );
    //     }


    // function countyLookUp(lat, lon){
    // 	$.ajax(`https://geo.fcc.gov/api/census/area?lat=${lat}&lon=${lon}&format=json`)
    // 	.then(
    // 	    function success(response) {
    //           	toastr.info(`Current location : <br>${response.results[0].county_name} County, ${response.results[0].state_code}`)
    // 	    },

    // 	    function fail(data, status) {
    // 	        console.log('Request failed.  Returned status of',
    // 	                    status);
    // 	    }
    // 	);
    // }

    var loadMapFilter = function(){
    	// $('#landingpage_container').prepend(``)

		$('.filter').dragmove();
		$('.btn-group').on('click', function(){
		    $($(this).children()).each(function(){
		        $(this).toggleClass('active');
		    if($(this).hasClass('active')){$(this).prop('disabled', true)}else{$(this).prop('disabled', false)}
		    })
		})
    }
})