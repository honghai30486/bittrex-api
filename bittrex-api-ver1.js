var apikey='574a5202182646fd8251a2c8138a969e';
var apisecret ="d965d8ed739a4918b680e59276bc58c7"
var apiURL = 'https://bittrex.com/api/v1.1'
var lastNonces = [];
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