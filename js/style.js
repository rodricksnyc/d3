"use strict"


// let sheet = document.createElement('style'),  
//   $rangeInput = $('.range input'),
//   prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

// document.body.appendChild(sheet);

// let getTrackStyle = function (el) {  
//   let curVal = el.value,
//       val = (curVal - 1) * 25,
//       style = '';
  
//   $('.range-labels li').removeClass('active selected');
  
//   let curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');
  
//   curLabel.addClass('active selected');
//   curLabel.prevAll().addClass('selected');
  

//   for (let i = 0; i < prefs.length; i++) {
//     style += '.range {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
//     style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
//   }

//   return style;
// }

// let previousVal;
// let btnClick;

// $rangeInput.on('input', function () {
//   sheet.textContent = getTrackStyle(this);
// });

// $('.range-labels li').on('click', function () {
//   let index = $(this).index();
//   $rangeInput.val(index + 1).trigger('input');
// });

// $( window ).on( "load", function(){
//   $rangeInput.val(($('.range-labels li.active.selected').index()) + 1).trigger('input');
// });

// $('.btnPlay').on('click', function(){
//   $(this).hide();
//   $('.btnPause').show();
//   stop = false;
//   btnClick = true;
//   d3Container.dataUpdate(Number(($('.range-labels li.active.selected').index()) + 1)*500, previousVal, (Number((($('.range-labels li.active.selected').index()) + 1))*500 > previousVal) ? true : false);
// })

// $('.btnPause').on('click', function(){
//   $(this).hide();
//   $('.btnPlay').show();
//   stop = true;
// })