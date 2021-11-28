function randomGen(redirectURL) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	var url = new URL(redirectURL);
	var hostname = url.hostname.replace("www.", "");

	var len = 25;
	chrome.storage.local.get(function (data) {
		var domain = data.domains[hostname]
		if(domain != undefined){
			len = domain.keyLen;
			for (var i = 0; i < len; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			document.getElementById("randomString").innerHTML = text;
		}
	});
}

window.onload = function () {
	document.getElementById('entered').onpaste = function (e) {
		e.preventDefault();
	}
	var url = (new URLSearchParams(window.location.search)).get("redirect");
	randomGen(url);
	document.getElementById('answer').onsubmit = function () {
		if (document.getElementById("randomString").innerHTML == document.getElementById('entered').value) {
			chrome.extension.getBackgroundPage().skipURL = url;
			window.location.replace(url);
		}
		return false;
	}

	chrome.bookmarks.search("Hype", function (array) {
		if(array.length != 0){
			var folder = array[0];
			chrome.bookmarks.getChildren(folder.id, function (bookmarks) {
				var index = Math.floor(Math.random() * bookmarks.length);
				var bookmark = bookmarks[index];
				while(!bookmark.url.includes("youtube")){
					index = Math.floor(Math.random() * bookmarks.length);
					bookmark = bookmarks[index];
				}

				var video_id = bookmark.url.split('v=')[1];
				var ampersandPosition = video_id.indexOf('&');
				if (ampersandPosition != -1) {
					video_id = video_id.substring(0, ampersandPosition);
				}
				var motivator = document.getElementById("motivator");
				motivator.setAttribute('src', "https://youtube.com/embed/" + video_id + "?modestbranding=1&autoplay=1&controls=0");

			});
		}	
	});
}

