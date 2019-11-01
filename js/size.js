"use strict";

function getSize(){
	(function(result){
		buildMap(result(), ".mapContainer svg#map", false, {id:29055})
	})(function(){
		let $WI = window.innerWidth || document.querySelector('HTML').clientWidth,
			$WH = window.innerHeight || document.querySelector('HTML').clientHeight,
			$HH = $('#header').height() || 124,
			$FH = $('#footer').height() || 32,
			$MAPCONTAINER = $('.mapContainer');

		$('#landingpage_container').css({ height : `${$WH - ($HH)}px`});
		function checkLargeScreen(){
			return $WI > 1799 ? true : false;
		}

		// if($WH - ($HH + $FH + 64) < 590){
		// 	var diff = 600 - ($WH - ($HH + $FH)), proportion = 1 - diff/600;
		// 	$('.filter').css({transform : `scale(${proportion})`})
		// }

		function setMapContainerWidth(){
		 	// if(checkLargeScreen()){ $('HTML').addClass('W-1799')}
			let estLeftMargin = $('.filter').width() + 96,
				availableHeight = $WH - ($HH + 74),
			 	availablewidth = checkLargeScreen() ? 1360 : $WI - estLeftMargin,
			 	result = (availablewidth * 0.58) > availableHeight ? (availableHeight * 1.72) : availablewidth;
			 	return result;
		}

		let smcw = setMapContainerWidth();
		return smcw;
	})
}
