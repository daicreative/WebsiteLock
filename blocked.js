function randomGen() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

window.onload = function(){
	document.getElementById('entered').onpaste=function(e){
		e.preventDefault();
	}
	var copy=randomGen();
	document.getElementById("randomString").innerHTML = copy;
	document.getElementById('answer').onsubmit=function(){
		if(copy==document.getElementById('entered').value){
			var parser=document.createElement('a');
			chrome.storage.sync.get(function(data){
				parser.href=data.base;
				var l=data.blacklist.length;
				for(var i=0;i<l;i++){
					if(parser.hostname==data.blacklist[i][0]){
						data.blacklist[i][1]=false;
						chrome.storage.sync.set(data);
					}
				}
			});
			chrome.storage.sync.get(function(data){
				chrome.tabs.update(null,{"url":data.base});
			});
		}
	}

}
