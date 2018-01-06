console.log("bittrex-balance-addin.js file is loaded");

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/honghai30486/bittrex-api/master/bittrex-api-ver1.js?ver="+(new Date()).getTime();
$("head").append(s);

var buttonAll = document.createElement("button");
buttonAll.innerHTML = "SELL ALL";
buttonAll.className = "btn btn-default btn-toolbar";
$("balanceTable_paginate").append(buttonAll);
buttonAll.addEventListener ("click", sellAll);
$(buttonAll).insertBefore($('#toolbar-balances').find('[type=button]'));

var buttonLoad = document.createElement("button");
buttonLoad.innerHTML = "(.)(.)";
buttonLoad.className = "btn btn-default btn-toolbar";
$(buttonLoad).insertBefore($('#toolbar-balances').find('[type=button]'));
buttonLoad.addEventListener ("click", load);

function load(){
	//Check exist
	if($("#balanceTable tbody").find("select").size() > 0) return;
	
	$("#balanceTable tbody").find("tr").each(function(){
		var marketName = $(this).find("a").html();
		if (marketName === undefined){
			marketName = $(this).find("td.text").html();
		}
		
		if (marketName == "USDT" || marketName == "BTC") return;
		
		$(this).append("<select id='percent_"+marketName+"' style='color: black'><option value='30'>30%</option><option value='50'>50%</option><option value='80'>80%</option><option value='100' selected>100%</option></select>");
		
		var buttonSell = document.createElement("button");
		buttonSell.innerHTML = "SELL";
		$(this).append(buttonSell);
		buttonSell.addEventListener ("click", function() {
			sellOrder(marketName);
		});
		
		var buttonCancel = document.createElement("button");
		buttonCancel.innerHTML = "CANCEL";
		$(this).append(buttonCancel);
		buttonCancel.addEventListener("click", function() {
			cancelOrder(marketName);
		});
	
	});
}

function cancelOrder(marketName){
	console.log("Action: CANCEL");
	getopenorders("BTC-"+marketName,function(data){
		$.each(data.result, function(i, record) {
			cancel(record.OrderUuid, function(){
				console.log("CANCEL OK");
			});
			
		});
	});
}

function sellOrder(marketName){
	var market = "BTC-"+marketName;
	console.log("Action: SELL");
	//Get marketSummary
	getbalance(marketName, function(balance){
		var avaribaleBalance =  balance.result.Available;
		getmarketsummary(market, function(marketsummary){
			var rate = marketsummary.result[0].Bid*sellrate;
			var percent = $("#percent_"+marketName).val();
			var quantity = avaribaleBalance * percent/100;
			var message =  'Rate        :  ' + rate 
						+'\nQuantity :  '+quantity+'  ('+percent+'%)'
						+'\n\nAre you OK?'
			if(confirm(message)){
				selllimit(market,quantity,rate,function(){
					console.log("SELL OK");
				})
			}
		});
	});
}
function sellAll(){
	console.log("Action: SELL_ALL");
	load();
	getbalances(function(balances){
		getmarketsummaries(function(marketsummaries){
			getorderhistory("",function(orderhistories){
				var priceArray = {};
				$.each(marketsummaries.result, function(i, record) {
					priceArray[record.MarketName] = record.Bid
				});
				
				var quantityArray = {};
				$.each(balances.result, function(i, record) {
					if (record.Available > 0){
						quantityArray[record.Currency] = record.Available
					}
				});
				
				var orderArray={};
				$.each(orderhistories.result, function(i, record) {
					if (record.OrderType = 'LIMIT_BUY' && orderArray[record.Exchange] == undefined){
						orderArray[record.Exchange] = record.PricePerUnit;
					}
				});
				
				console.log(balances)
				console.log(marketsummaries)
				console.log(priceArray)
				console.log(quantityArray)
				console.log(orderArray)
				
				var items = [];
				var message ='WARNING: SELL ALL. Are you OK?';
				message +=   '\n---------------------------------------------------------------------------'
				message +=   '\n|　Currency |  Quantity (xx%)                   |   Rate          | BTC  | Profit  |'
				message +=   '\n---------------------------------------------------------------------------'
				$("#balanceTable tbody").find("tr").each(function(){
					var marketName = $(this).find("a").html();
					if (marketName === undefined){
						marketName = $(this).find("td.text").html();
					}
					
					if (marketName == "USDT" || marketName == "BTC") return;
					
					var percent = $("#percent_"+marketName).val();
					
					var sellItem = {
						'Currency':marketName,
						'Quantity':quantityArray[marketName]*percent/100, 
						'Rate': priceArray['BTC-'+marketName]*sellrate, 
						'Est': priceArray['BTC-'+marketName]*sellrate*quantityArray[marketName]*percent/100,
						'Profit': ((((priceArray['BTC-'+marketName]*sellrate) - orderArray['BTC-'+marketName])*100/orderArray['BTC-'+marketName]) - 0.25)
					}
					sellItem.Profit = sellItem.Profit > 0 ? ("↑" + sellItem.Profit.toFixed(2).padStart(5,'0')): ("↓" + (0-sellItem.Profit).toFixed(2).padStart(5,'0'))
					items.push(sellItem)
					console.log(sellItem);
					message += '\n|　'+convertHaftToFull(marketName)+'    |  '
					message += sellItem.Quantity.toFixed(6).padStart(16,'0')+ '('+ percent.padStart(3,' ') +'%) | ' + sellItem.Rate.toFixed(8) + ' | ' + sellItem.Est.toFixed(2) + ' | ' +sellItem.Profit + ' |';
				});
				message +=   '\n---------------------------------------------------------------------------'
				
				if (confirm(message)){
					$.each(items, function(i, record) {
						selllimit("BTC-"+record.Currency,record.Quantity,record.Rate,function(){
							console.log("SELL BTC-"+record.Currency+" OK");
						})
					});
				}
			});
		});
	});
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function convertHaftToFull(input){
	return input.replace(/[A-Za-z0-9]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
	});
}
