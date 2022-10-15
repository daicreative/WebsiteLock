skipURL = "";

chrome.runtime.onInstalled.addListener(function (details) {
	initializeDefaultValues();
});

function initializeDefaultValues() {
	chrome.storage.local.get(function (data) {
		if (data.domains == undefined) {
			data.domains = {}
			chrome.storage.local.set(data);
		}
	});
}

chrome.tabs.onUpdated.addListener(function (tabId, changedInfo, tab) {

	if (changedInfo.status == "loading") {

		if (trim(tab.url) == trim(skipURL)) return;
		skipURL = "";

		var url = new URL(tab.url);
		var hostname = url.hostname.replace("www.", "");


		chrome.storage.local.get(function (data) {
			// Check if hostname is a checked domain

			var domain = data.domains[hostname];
			if (domain != undefined) {
				var block = false;
				for (var i = 0; i < domain.regexes.length; i++) {
					var regex = new RegExp(domain.regexes[i]);

					if (regex.test(url.pathname)) {
						block = true;
						break;
					}
				}

				if (block) {
					chrome.tabs.update(tabId, {
						"url": "blocked.html?redirect=" + tab.url
					});
				}
			}
		});
	} 
});

function trim(s) {
	return s.replace(/\/+$/, "");
}