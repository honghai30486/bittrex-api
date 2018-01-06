var apiURL = 'https://bittrex.com/api/v1.1';
var lastNonces = [];

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/sytelus/CryptoJS/master/rollups/hmac-sha512.js";
$("head").append(s);

function getNonce() {
    var nonce = new Date().getTime();
    if (lastNonces.indexOf(nonce) > -1) {
      // we already used this nonce so keep trying to get a new one.
      return getNonce();
    }

    // keep the last X to try ensure we don't have collisions even if the clock is adjusted
    lastNonces = lastNonces.slice(-50);
    lastNonces.push(nonce);

    return nonce;
};

function publicApiCall(command,options){
	var uri = apiURL + command + "?";
	var o = Object.keys(options),i;
    for (i = 0; i < o.length; i++) {
      uri += "&" + o[i] + "=" + options[o[i]];
    }
	uri = uri.replace("?&", "?");
	var result
	$.getJSON(uri, function(data) {
		//data is the JSON string
		result = data.result;
		console.log(data.result);
	});
	console.log(result);
	return result;
	
}

function getmarkets(callback)
{
	var options = {	}
	return publicApiCall('/public/getmarkets', options);
}

function getcurrencies(callback)
{
	var options = {	}
	return publicApiCall('/public/getcurrencies', options);
}

function getticker(callback)
{
	var options = {	}
	return publicApiCall('/public/getticker', options);
}

function getmarketsummary(market)
{
	var options = {	
		'market':market
	}
	return publicApiCall('/public/getmarketsummary', options);
}

function getmarketsummaries(callback)
{
	var options = {	}
	return publicApiCall('/public/getmarketsummaries', options);
}

function getorderbook(market,type, callback)
{
	var options = {	
		'market':market,
		'type':type
	}
	return publicApiCall('/public/getorderbook', options);
}

function getmarkethistory(market, callback)
{
	var options = {	
		'market':market
	}
	return publicApiCall('/public/getmarkethistory', options);
}

function credentialApiCall(command,options, callback)
{
	var uri = apiURL + command + "?apikey=" + apikey+'&nonce=' + getNonce();
	var o = Object.keys(options),i;
    for (i = 0; i < o.length; i++) {
      uri += "&" + o[i] + "=" + options[o[i]];
    }
	uri = uri.replace("?&", "");
	var sign = CryptoJS.HmacSHA512(uri, apisecret);
	$.ajax({
		url: uri,
		headers: {
			'apisign': sign, 
			'Content-Type': 'application/json'
		},
		method: 'POST',
		success: callback
	});
}

function buylimit(market, callback)
{
	var options = {
		'market':market
	}
	credentialApiCall('/market/buylimit', options, callback);
}

function selllimit(market, callback)
{
	var options = {
		'market':market
	}
	credentialApiCall('/market/selllimit', options, callback);
}

function cancel(uuid, callback)
{
	var options = {
		'uuid':uuid
	}
	credentialApiCall('/market/cancel', options, callback);
}

function getopenorders(market, callback)
{
	var options = {
		'market':market
	}
	credentialApiCall('/market/getopenorders', options, callback);
}

function getbalances(callback)
{
	var options = {	}
	credentialApiCall('/account/getbalances', options, callback);
}

function getbalance(currency, callback)
{
	var options = {
		'currency':currency
	}
	credentialApiCall('/account/getbalance', options, callback);
}

function withdraw(quantity, address, callback)
{
	var options = {
		'quantity':quantity,
		'address':address
	}
	credentialApiCall('/account/withdraw', options, callback);
}

function getorder(uuid, callback)
{
	var options = {
		'uuid':uuid
	}
	credentialApiCall('/account/getorder', options, callback);
}

function getorderhistory(callback)
{
	var options = {

	}
	credentialApiCall('/account/getorderhistory', options, callback);
}

function getwithdrawalhistory(currency, callback)
{
	var options = {
		'currency':currency
	}
	credentialApiCall('/account/getwithdrawalhistory', options, callback);
}

function getdeposithistory(currency, callback)
{
	var options = {
		'currency':currency
	}
	credentialApiCall('/account/getdeposithistory', options, callback);
}

function getdeposithistory(currency, callback)
{
	var options = {
		'currency':currency
	}
	credentialApiCall('/account/getdeposithistory', options, callback);
}

console.log("bittrex-api-ver1.js file is loaded");
