function removeSite(){
	var id=this.id;
	chrome.storage.sync.get(function(data){
		var l=data.blacklist.length;
		for(var i=0;i<l;i++){
			if(data.blacklist[i][0]==id){
				data.blacklist.splice(i,1);
				chrome.storage.sync.set(data);
			}
		}
	});
	location.reload();
}
window.onload = function(){
	document.getElementById('save').onclick = function(){

		var value=document.getElementById('saveLine').value;
		var parser=document.createElement('a');
		parser.href=value;
		if(value.includes("http://") || value.includes("https://")){
			value=parser.hostname;
			chrome.storage.sync.get(function(data){
				if(data.blacklist==undefined){
					data.blacklist=[[value,true]];
				}
				else if(data.blacklist.indexOf(value)==-1){
					data.blacklist.push([value,true]);
				}
				chrome.storage.sync.set(data);
			});
		}
		location.reload();
	}
	document.getElementById('delete').onclick=function(){
		chrome.storage.sync.clear();
		location.reload();
	}
	chrome.storage.sync.get(function(data){
		if(data.blacklist){
			var l=data.blacklist.length;
			for(var i=0;i<l;i++){
				var newButton=document.createElement("button");
				var newID=data.blacklist[i][0];
				newButton.id=newID;
				newButton.innerHTML="Delete:" + newID;
				newButton.style.display="block";
				document.body.appendChild(newButton);
				newButton.addEventListener("click",removeSite);			
			}
		}
	});

}

