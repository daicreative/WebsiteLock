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
/*	        chrome.tabs.executeScript(null,{file:'blocked.js'}); */
/*		   if (changeInfo.status == 'complete') {   
		   	alert("done");
		      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		         chrome.tabs.sendMessage(tabs[0].id, {action: "SendIt"}, function(response) {});  
		      });
		   }*/
		   chrome.storage.sync.set({"base":tab.url});
		}

	});
   	
});