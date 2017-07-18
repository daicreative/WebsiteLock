window.onload = function(){
	document.getElementById('save').onclick = function(){
		var value=document.getElementById('saveLine').value;
		console.log(value);
		if(value!=""){
			var parser=document.createElement('a');
			parser.href=value;
			console.log(parser.hostname);
			chrome.storage.sync.get(function(data){
				if(data.blacklist==undefined){
					data.blacklist=[parser.hostname];
				}
				else{
					data.blacklist.push(parser.hostname);
				}
				chrome.storage.sync.set(data);
			});
		}
	}
	document.getElementById('delete').onclick=function(){
		chrome.storage.sync.clear();
	}

}



/*window.onload = function(){
	document.getElementById('save').onclick = function(){
		var value=document.getElementById('saveLine').value;
		alert(value);
		chrome.storage.sync.set({'myLine':value});
	}
	document.getElementById('get').onclick = function(){
		chrome.storage.sync.get('myLine', function(data){
			alert(data.myLine);
		});
	}
}



*/