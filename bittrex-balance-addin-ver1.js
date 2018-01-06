console.log("bittrex-balance-addin.js file is loaded");

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/honghai30486/bittrex-api/master/bittrex-api-ver1.js?ver="+(new Date()).getTime();
$("head").append(s);

var buttonLoad = document.createElement("button");
buttonLoad.innerHTML = "TOOL";
$("#toolbar-balances").append(buttonLoad)
buttonLoad.addEventListener ("click", load);

function load(){
	$("#balanceTable tbody").find("tr").each(function(){
		var marketName = $(this).find("a").html();
		if (marketName === undefined){
			marketName = $(this).find("td.text").html();
		}
		
		if (marketName == "USDT") return;
		
		$(this).append("<select id='percent_"+marketName+"' style='color: black'><option value='30'>30%</option><option value='50'>50%</option><option value='80'>80%</option><option value='100' selected>100%</option></select>");
		var buttonCancel = document.createElement("button");
		buttonCancel.innerHTML = "CANCEL";
		$(this).append(buttonCancel);
		buttonCancel.addEventListener("click", function() {
			cancelOrder(marketName);
		});
		
		var buttonSell = document.createElement("button");
		buttonSell.innerHTML = "SELL";
		$(this).append(buttonSell);
		buttonSell.addEventListener ("click", sellOrder);
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
	console.log("Action: SELL");
	//Get marketSummary
	var marketsummary = getmarketsummary("BTC-"+marketName);
	console.log(marketsummary);
	return;
	//Get percent cell
	var percent = $("percent_"+marketName).val();
	console.log(percent);
	
	
	if (marketsummary != null){
		var sellAmount = parseInt(marketsummary.result.Available * percent/100);
		var rate = marketsummary.res
		console.log(sellAmount);
		getbalance(marketName, function(data){
			// selllimit("BTC-"+marketName,quantity,rate,function(){
				// console.log("SELL DONE");
			// });
		})
	}
	
	$('#percent_'+marketName).val()
}
