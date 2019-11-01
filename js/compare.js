"use strict";

// mapfilter Toggle

//URL update

// $('#exampleModal').on('show.bs.modal', function (e) {
//   history.pushState({}, 'Home', '?overlay=true');
// });

// $('#exampleModal').on('hide.bs.modal', function (e) {
//   history.replaceState({}, 'Home', '?overlay=false');
// });


// function updateQueryStringParameter(uri, key, value) {
//   var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
//   var separator = uri.indexOf('?') !== -1 ? "&" : "?";
//   if (uri.match(re)) {
//     return uri.replace(re, '$1' + key + "=" + value + '$2');
//   }
//   else {
//     return uri + separator + key + "=" + value;
//   }
// }


//Testing Purposes
// function filterdd(t, l, e) {
//         let v = $(t).val() || "",
//                 s = 0;
//         if(v === "" || v === null){
//           return false
//         }else{
//           $(l).each(function(e, i) {
//                   if (v !== "" || v !== undefined) {
//                           if (i.innerHTML.toLowerCase().indexOf(v.toLowerCase()) > -1) {
//                                   $(i).show();
//                                   // d3.select(`.county_${$(i).attr("data-value")}`).style('fill', d3Container.colorFill)
//                                   s--;
//                           } else {
//                                   $(i).hide();
//                                   // d3.select(`.county_${$(i).attr("data-value")}`).style('fill', 'transparent')
//                                   s++;
//                           }
//                   } else {
//                           $(i).show();
//                   }
//           });
//           if(s === $(l).length){
//             $(`${e} ul span.noresult`).show();
//           }else{
//             $(`${e} ul span.noresult`).hide();
//           }
//           return true;
//         } 
// }
let stateCountyId = d3.map();
let compareS = {
        firstS: {
                stateListLoaded: false,
                stateSelected: false,
                state: "",
                stateValue: "", 
                stateListHidden: false,
                countyListLoaded: false,
                countySelected: false,
                county: "",
                countyValue: "",
                countyListHidden: true,
        },
        secondS: {
                stateListLoaded: false,
                stateSelected: false,
                state: "",
                stateValue: "", 
                stateListHidden: false,
                countyListLoaded: false,
                countySelected: false,
                county: "",
                countyValue: "",
                countyListHidden: true,
        }
        // meta: {
        //       firstCounty : {},
        //       secondCounty : {}
        // },
        // currentSelection: 0
}

let getStateCountyList = new Promise(
        function(resolve, reject) {
                d3.queue()
                        .defer(d3.json, "./src/usmap_id.json")
                        .awaitAll(ready);

                function ready(error, results) {
                        if (!error) {
                                _.forEach(results[0], (r) => {
                                        stateCountyId.set(r.id.toString().length === 4 ? `0${r.id}` : (r.id.toString().length === 1 ? `0${r.id}` : r.id), {
                                                "name": r.name,
                                                "code": r.code
                                        });
                                });
                                resolve(true);
                        }
                }
        })

getStateCountyList.then(function(v, u) {
        _.forEach(stateCountyId.keys(), (r) => {
                if (r.length === 2) {
                        $('.ddList--ul.state').each(function(i) {
                                let pick = ["firstS", "secondS", "home"];
                                $(this).append(`<li class="ddList--li f-16 t-navyblue animated fadeInUp" data-attached=${pick[i]} data-value=${r}>${stateCountyId.get(r).name}</li>`);
                                compareS[pick[i]].stateListLoaded = true;
                        });
                }
        })
        $('.state .ddList--li').click(function() {
            stateSelected(this, `.${$(this).attr('data-attached')} .state .ddList--li`);
        })
})

function loadCountyList(v, i, e) {
        _.forEach(stateCountyId.keys(), (r) => {
                if (r.length === 5) {
                        if (r.substring(0, 2) === v) {
                                if (r !== `${v}000`) {
                                        let n = "", d = false;
                                        if (v === "02") {
                                                n = `${stateCountyId.get(r).name}`;
                                        } else if (v === "22") {
                                                n = `${stateCountyId.get(r).name} Parish`;
                                        } else {
                                                n = `${stateCountyId.get(r).name} County`;
                                        }
                                        $(`.${e} .ddList--ul.county`).append(`<li class="ddList--li f-16 t-navyblue animated fadeInUp" data-value=${r} data-attached=${e}>${n}</li>`)
                                }
                        }
                }
        })
        compareS[e].countyListLoaded = true;
        $(`.${e} .ddList--ul.county .ddList--li`).click(function() {
          countySelected(this, `.${$(this).attr('data-attached')} .county .ddList--li`, e);
        })
}

function filterdd(t, l, e) {
        let v = $(t).val() || "",
                s = 0;
        if(v === "" || v === null){
          return false
        }else{
          $(l).each(function(e, i) {
                  if (v !== "" || v !== undefined) {
                          if (i.innerHTML.toLowerCase().indexOf(v.toLowerCase()) > -1) {
                                  $(i).show();
                                  // d3.select(`.county_${$(i).attr("data-value")}`).style('fill', function(d){
                                  //     return '#000000';
                                  // })
                                  s--;
                          } else {
                                  $(i).hide();
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

function stateSelected(t, p) {
      let $t = $(t), $tda = $(t).attr('data-attached'), $tdv = $(t).attr('data-value');
        $(p).each(function() { $(this).removeClass('active')});
        $t.addClass('active');
        $(`.${$tda} .ddsearch`).val(``).attr('placeholder', `Select a county in `);
        $(`.${$tda}`).append(`<button class="selectedState" data-attached=${$tda}>${stateCountyId.get($tdv).name}&nbsp; <i class="fas fa-times"></i></button>`);
        $(`.${$tda} .selectedState`).click(function() { resetddl($tda)})
        $(`.${$tda} .ddList--ul.state`).hide();
        $(`.${$tda} .ddList--ul.county`).show();
        Object.assign(compareS[$tda], {
            stateSelected : true,
            state : stateCountyId.get($tdv).name,
            stateValue: $tdv,
            stateListHidden : true,
            countyListHidden : false
        });
        loadCountyList($tdv, $(`.${$tda} .ddsearch`), $tda);
}

function countySelected(t, p, e) {
        $(p).each(function() {
                $(this).removeClass('active')
        });
        $(t).addClass('active');
        Object.assign(compareS[e], {countySelected : true, county: stateCountyId.get($(t).attr('data-value')).name, countyValue: $(t).attr('data-value')})
        $(`.${e} .selectedState`).html(`${$(t).html()}, ${stateCountyId.get($(t).attr('data-value').substring(0,2)).code}&nbsp; <i class="fas fa-times"></i>`);
        $(`.${e} .ddsearch`).attr('placeholder', `Current selection: `);
        
        validateSelected();
        console.log(validateSelected().message);
}

$('.ddsearch').on("input", function(e) {
        if (compareS[$(this).attr('data-attached')].stateSelected === true) {
                $('.selectedState').css({
                        left: 'unset',
                        right: "3em"
                });
        }
        filterdd(this, `.${$(this).attr('data-attached')} .ddList--li`, `.${$(this).attr('data-attached')}`);
});



function resetddl(e) {
        $(`.${e} .selectedState`).remove();
        $(`.${e} .ddsearch`).attr('placeholder', `Select a state to choose a county`);
        $(`.${e} .ddList--ul.county`).empty().hide();
        $(`.${e} .ddList--ul.state`).show();
        $(`.${e} .ddList--ul.state .ddList--li`).each(function() {
                $(this).removeClass('active')
        });
        Object.assign(compareS[e], {
          stateListLoaded: true,
          stateSelected: false,
          state: "",
          stateValue: "",
          stateListHidden: false,
          countyListLoaded: false,
          countySelected: false,
          county: "",
          countyValue: "",
          countyListHidden: true,
        });
        validateSelected();
        console.log(validateSelected().message);
}

var validateSelected = function(){
    if(!compareS.firstS.countySelected && compareS.firstS.county === ""){
      $('.btnSubmit').prop('disabled', true);
      return {status: false, message: "Please select first county"};
    }else if(!compareS.secondS.countySelected && compareS.secondS.county === ""){
      $('.btnSubmit').prop('disabled', true);
      return {status: false, message: "Please select second county"};
    }else{
      $('.btnSubmit').prop('disabled', false);
      return {status: true, message: "County selection successful, please hit button \"Submit\" to compare."};
    }
}


function checkDuplicate(v){
      if(v === compareS.firstS.county){
        return true;
      }else if(v === compareS.secondS.county){
         return true;
      }else{
        return false;
      } 
}

var btnSubmit = function(){
  let currentH = $('.compareS').height();
  $('.compareS').children().hide();
  $('.compareS svg').show();
  $('.compareS').append(buildMap(900, '.compareS svg', true, {id:29055}))
  $('.compareS').append(`<div class="loader"></div>`)
// workerFor.postMessage(compareS);      

}

var workerFor = new Worker('/js/workers/for.js');

workerFor.onmessage = function(event){
    let cl = event.data.split(',');
    $(`.${cl[0]}`).show();
    $(`.${cl[0]}`).html(`${cl[1]}`);
};

workerFor.onerror = function(event) {
    console.error('error received from workerFor => ', event);
    $('.loadingStatus').html(`Currently loading ${event} row`);
};

$('.btnSubmit').click(function(e){
  validateSelected().status ? btnSubmit() : $(e).stopPropagation();
});


//   // {
   //    "id": 60,
   //    "code": "AS",
   //    "name": "America Samoa"
   // },
   // {
   //    "id": 64,
   //    "code": "FM",
   //    "name": "Federated States of Micronesia"
   // },
   // {
   //    "id": 66,
   //    "code": "GU",
   //    "name": "Guam"
   // },
   // {
   //    "id": 68,
   //    "code": "MH",
   //    "name": "Marshall Islands"
   // },
   // {
   //    "id": 69,
   //    "code": "MP",
   //    "name": "Northern Mariana Islands"
   // },
   // {
   //    "id": 70,
   //    "code": "PW",
   //    "name": "Palau"
   // },
   // {
   //    "id": 72,
   //    "code": "PR",
   //    "name": "Puerto Rico"
   // },
   // {
   //    "id": 74,
   //    "code": "UM",
   //    "name": "U.S. Minor Outlying Islands"
   // },
   // {
   //    "id": 78,
   //    "code": "VI",
   //    "name": "Virgin Islands of the United States"
   // }































