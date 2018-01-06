console.log("bittrex-balance-addin.js file is loaded");

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/honghai30486/bittrex-api/master/bittrex-api-ver1.js?ver="+(new Date()).getTime();
$("head").append(s);

var buttonLoad = document.createElement("button");
buttonLoad.innerHTML = "(.)(.)";
buttonLoad.className = "btn btn-default btn-toolbar";
$(buttonLoad).insertBefore($('#toolbar-balances').find('[type=button]'));
buttonLoad.addEventListener ("click", load);

function load(){
	//Check exist
	if($("#balanceTable tbody").find("select").size() > 0) return;
	
	$("#balanceTable thead").find("tr").each(function(){
		console.log("add sell all")
		var buttonAll = document.createElement("button");
		buttonAll.innerHTML = "SELL ALL";
		$(this).append(buttonAll);
		buttonAll.addEventListener ("click", sellAll);
		
	});
	
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
		buttonSell.addEventListener ("click", function() {
			sellOrder(marketName);
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
	
}
