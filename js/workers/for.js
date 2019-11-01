

self.onmessage = function (event) {
	self.importScripts('/PapaParse/papaparse.min.js', 'https://unpkg.com/axios/dist/axios.min.js');
	//   <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	// debugger;
	let compareS = event.data, va1 = [], va2 = [], timerStart = performance.now();

	let firstS = new Promise(
		function (resolve, reject) {
			papaparse(resolve, compareS.firstS);
		})
	function papaparse(resolve, r) {
		// let i = 0, file = (r.stateValue === "01" || r.stateValue === "02") ? `/PIAAC/src/${r.stateValue}_Literacy_Average.csv` : `/PIAAC/src/Literacy_Average.csv`;
		axios.get('/PIAAC DATA/file.json')
			.then(function (response) {
				debugger;
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		// Papa.parse(file, {
		//   download: true,
		//   header: true,
		//   skipEmptyLines : true,
		//   error: function(err){
		//   	return reject(true);
		//   },
		//   step: function(row) {
		//     	va1[i] = row.data[0][`C${r.countyValue}`];
		// 		self.postMessage(`loadingStatus, Currently loading <b>${r.county} county's</b> ${i++} row from sample and its value ${row.data[0][`C${r.countyValue}`]}`)
		//   },
		//   complete: function(results) {
		// 		self.postMessage(`loadingStatus, <b>${r.county} county</b> data loaded!!! Time taken : ${performance.now() - timerStart}ms`)
		//     return resolve(va1);
		//   }
		// });
	}

	// firstS.then(function(v, u){
	//     function rg(r){
	//     	    let i = 0, file = (r.stateValue === "01" || r.stateValue === "02") ? `/PIAAC/src/${r.stateValue}_Literacy_Average.csv` : `/PIAAC/src/Literacy_Average.csv`;
	//     	    Papa.parse(file, {
	//     	      download: true,
	//     	      header: true,
	//     	      skipEmptyLines : true,
	//     	      error: function(err){
	//     	      	return reject(true);
	//     	      },
	//     	      step: function(row) {
	//     	        	va2[i] = row.data[0][`C${r.countyValue}`];
	// 				self.postMessage(`loadingStatus1, Currently loading <b>${r.county} county's</b> ${i++} row from sample and its value ${row.data[0][`C${r.countyValue}`]}`)
	//     	      },
	//     	      complete: function(results) {
	// 				self.postMessage(`loadingStatus1, <b>${r.county} county</b> data loaded!!! Time taken : ${performance.now() - timerStart}ms`)
	//     	        return va2;
	//     	      }
	//     	    });
	// 		return va2;
	//     }
	//     // startCalculation(rg(compareS.secondS), v)
	// })

	//   function startCalculation(a, b){
	// 		let diff = [];
	//   		for (var i = a.length; i >= 0; i--) {
	//   			diff.push[Number(a[i]) - Number(b[i])];
	//   			self.postMessage(`loadingStatus2, Performing the calc fn. !!!! Time taken : ${performance.now() - timerStart}ms`)
	//   			console.log(diff[i]);
	//   		}
	//   		self.postMessage(`loadingStatus3, Diff variable created!!! Sorting values and Time taken : ${performance.now() - timerStart}ms`)
	//   		// diff.sort((a, b) => a - b); 
	//   		self.postMessage(`loadingStatus4, Sorting done!! Now calculating percentile and the <b>Overall Time taken : ${performance.now() - timerStart}ms</b>`)
	//   }
}