var target="";
function randomGen() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

window.onload = function(){
	var copy=randomGen();
	document.getElementById("randomString").innerHTML = copy;
	document.getElementById('submit').onclick = function(){
		if(copy==document.getElementById('entered').value){
			chrome.storage.sync.get(function(data){
				chrome.tabs.update({"url": data.base});
			});
			
		}
	}
}