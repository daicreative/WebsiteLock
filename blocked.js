function randomGen() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function redirect(url){
	chrome.tabs.update({"url":url});
}
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

window.onload = function(){
	document.getElementById('entered').onpaste=function(e){
		e.preventDefault();
	}
	var copy=randomGen();
	document.getElementById("randomString").innerHTML = copy;
	var ans=document.getElementById('answer');
	ans.onsubmit=function(){
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
				chrome.tabs.update({"url":data.base});
			});
			wait(.1);
		}

}
