var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://rawgit.com/honghai30486/bittrex-api/master/bittrex-api-ver1.js";
$("head").append(s);

$("#balanceTable tbody").find("tr").each(function(){
	var marketName = $(this).find("a").html();
	if (marketName === undefined){
		marketName = $(this).find("td.text").html();
	}
	
	//if (marketName == "BTC" || marketName == "USDT") return;
	
	$(this).append("<select id='percent_"+marketName+"' style='color: black'><option value='30'>30%</option><option value='50'>50%</option><option value='80'>80%</option><option value='100' selected>100%</option></select>");
	var buttonCancel = document.createElement("button");
	buttonCancel.innerHTML = "CANCEL";
	$(this).append(buttonCancel)

	var buttonSell = document.createElement("button");
	buttonSell.innerHTML = "SELL";
	$(this).append(buttonSell)
});
		