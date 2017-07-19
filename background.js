
	chrome.storage.sync.get(function(data){
							console.log("Data:"+JSON.stringify(data));
	});
chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab) {
	var parser=document.createElement('a');
	parser.href=tab.url;
	var linkList=[];
	chrome.storage.sync.get(function(data){
		if(data.blacklist!=undefined){
			linkList=data.blacklist;
		}
		var block=false;
		for(var i=0;i<linkList.length;i++){
			if(parser.hostname==linkList[i]){
				block=true;
			}
		}
		if(block==true){
	        chrome.tabs.update(tabId, {"url" : "blocked.html"});
		   chrome.storage.sync.set({"base":tab.url});
		}

	});
   	
});