chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab) {
	var parser=document.createElement('a');
	parser.href=tab.url;
	chrome.storage.sync.get(function(data){
		if(parser.href=="https://www.youtube.com/"){
			chrome.bookmarks.search("top picks", function(array){
				var folder = array[0];
				chrome.bookmarks.getChildren(folder.id, function(bookmarks){
					var index = Math.floor(Math.random() * bookmarks.length);
					var bookmark = bookmarks[index];
					var video_id = bookmark.url.split('v=')[1];
					var ampersandPosition = video_id.indexOf('&');
					if(ampersandPosition != -1) {
						video_id = video_id.substring(0, ampersandPosition);
					}
					chrome.tabs.update(tabId,{"url":"https://www.youtube.com/embed/" + video_id + "?autoplay=1&controls=0"});
				});
			});
					
		}
		else if(data.blacklist!=undefined){
			var block=false;
			var l=data.blacklist.length;
			for(var i=0;i<l;i++){
				if(parser.hostname==data.blacklist[i][0] && data.blacklist[i][1]==true){
					block=true;
				}
			}
			if(block && data.totalBlock){
				chrome.tabs.update(tabId, {"url" : "https://www.youtube.com/embed/Dev36qc3l2s?autoplay=1&start=181&controls=0"});
			}
			else if(block==true){
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
	if(alarm.name=="bootyos"){
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
			chrome.alarms.create("totally_blocked", {delayInMinutes:10});
		});
		chrome.storage.sync.set({"totalBlock":true});
	}
	else{
		chrome.storage.sync.set({"totalBlock":false})
	}
});