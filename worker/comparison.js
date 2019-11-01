self.onmessage = function (event) {	
	self.importScripts('../PapaParse/papaparse.min.js');
	let $Sel = [], $$Sel = [];
	if(event.data.bucket_2 !== null){
		Papa.parse(event.data.bucket_1, {
			download: true,
			header: true,
			skipEmptyLines: true,
			encoding: true,
			fastMode: true,
			error: function (err) {
				self.postMessage(err);
			},
			step: function (row) {
				let f = event.data.nation ? `\"${event.data.d1[0]}\"` : `\"C${event.data.d1[0]}\"`;
				// let f = `\"C${event.data.d1[0]}`;
				$Sel.push(row.data[f]);
			},
			complete: function (results) {
				renderSecondGroup();
			}
		});

		function renderSecondGroup(){
			let $SelCount = 0;
			Papa.parse(event.data.bucket_2, {
				download: true,
				header: true,
				skipEmptyLines: true,
				encoding: true,
				fastMode: true,
				error: function (err) {
					self.postMessage(err);
				},
				step: function (row) {
					let s = event.data.nation && event.data.single
					? `\"Nation\"`
					: event.data.nation && !event.data.single
					? `\"${event.data.d2[0]}\"`
					: event.data.single
					? `\"${event.data.d1[2].substring(
						event.data.d1[2].length - 2,
						event.data.d1[2].length
					  )}\"`
					: `\"C${event.data.d2[0]}\"`;
					// let s = event.data.single ? `${(event.data.d1[2]).substring((event.data.d1[2]).length -2, (event.data.d1[2]).length)}` : `C${event.data.d2[0]}`;
					$$Sel.push(Number((Number($Sel[$SelCount]) - Number(row.data[s])).toFixed(3)));
					$SelCount++;
				},
				complete: function (results) {
					$SelCount = 0;
					self.postMessage({$$Sel});
				}
			});
		}
	}else{
		Papa.parse(event.data.bucket_1, {
			download: true,
			header: true,
			skipEmptyLines: true,
			encoding: true,
			fastMode: true,
			error: function (err) {
				self.postMessage(err);
			},
			step: function (row) {
				let f = event.data.nation
            ? `\"${event.data.d1[0]}\"`
            : `\"C${event.data.d1[0]}\"`,
          s = event.data.nation && event.data.single
			? `\"Nation\"`
			: event.data.nation && !event.data.single
			? `\"${event.data.d2[0]}\"`
            : event.data.single
            ? `\"${event.data.d1[2].substring(
                event.data.d1[2].length - 2,
                event.data.d1[2].length
              )}\"`
			: `\"C${event.data.d2[0]}\"`;
			// let f = `C${event.data.d1[0]}`, s = event.data.single ? `${(event.data.d1[2]).substring((event.data.d1[2]).length -2, (event.data.d1[2]).length)}` : `C${event.data.d2[0]}`;
			$$Sel.push(Number((Number(row.data[f]) - Number(row.data[s])).toFixed(3)));
			},
			complete: function (results) {
				self.postMessage({$$Sel});
			}
		});
	}
}