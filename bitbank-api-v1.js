var bitbankAPI = "https://public.bitbank.cc/";

function tiker(currency, callback){
	uri += currency + "/ticker";
	$.ajax({
		url: uri,
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'GET',
		success: callback
	});
}