chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab) {
	var parser=document.createElement('a');
	parser.href=tab.url;
	chrome.storage.sync.get(function(data){
		if(parser.href=="https://www.youtube.com/"){
			chrome.tabs.update(tabId,{"url":"https://www.youtube.com/channel/UCQ8XFo9xXjbInPCwgcBolyg/playlists"});
		}
		else if(data.blacklist!=undefined){
			var block=false;
			var l=data.blacklist.length;
			for(var i=0;i<l;i++){
				if(parser.hostname==data.blacklist[i][0] && data.blacklist[i][1]==true){
					block=true;
				}
			}
			if(block==true){
		        chrome.tabs.update(tabId, {"url" : "blocked.html"});
			   chrome.storage.sync.set({"base":tab.url});
			}
		}
	});
   	
});

chrome.tabs.onRemoved.addListener(function(){
	chrome.storage.sync.get(function(data){
		var l=data.blacklist.length;
		var parser=document.createElement('a');
		parser.href="/";
		chrome.tabs.query({},function(tabs){
			var l2=tabs.length;
			for(var i=0;i<l;i++){
				if(data.blacklist[i][1]==false){
					var change=true;
					for(var j=0;j<l2;j++){
						parser.href=tabs[j].url;
						if(parser.hostname==data.blacklist[i][0]){
							change=false;
						}
					}
					if(change){
						var alarmChange=true;
						for(var j=0;j<l2;j++){
							for(var z=0;z<l;z++){
								if(z!=i && data.blacklist[z][1]==false && data.blacklist[z][0]==parser.hostname){
									alarmChange=false;
								}
							}
						}
						//turn off alarm if all relocked
						if(alarmChange){
							chrome.alarms.clear('bootyos');
						}
						data.blacklist[i][1]=true;
						chrome.storage.sync.set(data);
					}
				}
			}
		});
	});
});

chrome.alarms.onAlarm.addListener(function(alarm){
	chrome.storage.sync.get(function(data){
		var l=data.blacklist.length;
		var parser=document.createElement('a');
		parser.href="/";
		chrome.tabs.query({},function(tabs){
			for(var j=0;j<tabs.length;j++){
				parser.href=tabs[j].url;
				for(var i=0;i<l;i++){
					if(data.blacklist[i][0]==parser.hostname){
						chrome.tabs.remove(tabs[j].id);
					}
				}
			}
		});
	});

});