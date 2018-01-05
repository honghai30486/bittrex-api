var apiURL = 'https://bittrex.com/api/v1.1'
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

function publicApiCall(command,options, callback){
	var uri = apiURL + command + "?";
	var o = Object.keys(options),i;
    for (i = 0; i < o.length; i++) {
      uri += "&" + o[i] + "=" + options[o[i]];
    }
	uri = uri.replace("?&", "");
	var sign = CryptoJS.HmacSHA512(uri, apisecret);
	$.ajax({
		url: uri,
		method: 'GET',
		success: callback
	});
}

function getmarkets(callback)
{
	var options = {	}
	credentialApiCall('/public/getmarkets', options, callback);
}

function getcurrencies(callback)
{
	var options = {	}
	credentialApiCall('/public/getcurrencies', options, callback);
}

function getticker(callback)
{
	var options = {	}
	credentialApiCall('/public/getticker', options, callback);
}

function getmarketsummary(market, callback)
{
	var options = {	
		'market':market
	}
	credentialApiCall('/public/getmarketsummary', options, callback);
}

function getmarketsummaries(callback)
{
	var options = {	}
	credentialApiCall('/public/getmarketsummaries', options, callback);
}

function getorderbook(market,type, callback)
{
	var options = {	
		'market':market,
		'type':type
	}
	credentialApiCall('/public/getorderbook', options, callback);
}

function getmarkethistory(market, callback)
{
	var options = {	
		'market':market
	}
	credentialApiCall('/public/getmarkethistory', options, callback);
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
