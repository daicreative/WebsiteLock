function removeSite(){
	
}
window.onload = function(){
	chrome.storage.sync.get(function(datas){
							alert("1Data:"+JSON.stringify(datas));
	});
	document.getElementById('save').onclick = function(){

		var value=document.getElementById('saveLine').value;
		if(value!=""){
			var parser=document.createElement('a');
			parser.href=value;
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
	chrome.storage.sync.get(function(data){
		if(data.blacklist){
			var l=data.blacklist.length;
							console.log("Data:"+JSON.stringify(data) +" " + l);
			for(var i=0;i<l;i++){
				var newButton=document.createElement("input");
				newButton.type="button";
				newButton.id=data.blacklist[i];
				newButton.value="Delete:" + data.blacklist[i];
				newButton.addEventListener("onclick",function(){removeSite()});
				document.body.appendChild(newButton);
			}
		}
	});

}

