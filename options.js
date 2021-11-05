function removeRegex(domain_key, regex_index) {
	chrome.storage.sync.get(function (data) {
		data.domains[domain_key].splice(regex_index, 1);
		chrome.storage.sync.set(data);
	});
	location.reload();
}

function removeRegexWrapper(domain_key, regex_index){
	return function() {
		removeRegex(domain_key, regex_index);
	};
}

function removeDomain(domain_key) {
	chrome.storage.sync.get(function (data) {
		delete data.domains[domain_key];
		chrome.storage.sync.set(data);
	});
	location.reload();
}

function removeDomainWrapper(domain_key){
	return function() {
		removeDomain(domain_key);
	};
}

function addRegexRule(domain_key, rule) {
	chrome.storage.sync.get(function (data) {
		data.domains[domain_key].push(rule);
		chrome.storage.sync.set(data);
	});
	location.reload();
}

function addRegexRuleWrapper(domain_key, rule){
	return function() {
		addRegexRule(domain_key, rule.value);
	};
}

window.onload = function () {
	document.getElementById('domain_submit').onclick = function () {

		var value = document.getElementById('domain_text').value;
		if (value.includes("http://") || value.includes("https://")) {
			var url = new URL(value);
			var domain = url.hostname.replace("www.", "");

			chrome.storage.sync.get(function (data) {
				if (data.domains[domain] == undefined) {
					// domain doesn't exist yet, okay to add
					data.domains[domain] = [];
					chrome.storage.sync.set(data);
				}
			});
		}

		// Refresh to show on page
		location.reload();
	}


	chrome.storage.sync.get(function (data) {
		var div = document.getElementById("domains");
		for (const domain_key in data.domains) {
			var domain = data.domains[domain_key];

			var domainName = document.createElement("h2")
			domainName.innerHTML = domain_key;
			div.appendChild(domainName);

			var domainButton = document.createElement("button");
			domainButton.innerHTML = "Delete";
			domainButton.addEventListener("click", removeDomainWrapper(domain_key));
			domainName.appendChild(domainButton);

			var regexText = document.createElement("h3");
			regexText.innerHTML = "Add regex rule: ";
			div.appendChild(regexText);

			var ruleInput = document.createElement("input");
			ruleInput.type = "text";
			regexText.appendChild(ruleInput);

			var ruleButton = document.createElement("button");
			ruleButton.innerHTML = "Add";
			ruleButton.addEventListener("click", addRegexRuleWrapper(domain_key, ruleInput));
			regexText.appendChild(ruleButton);

			// List out all regex
			for (var i = 0; i < domain.length; i++) {
				var regex = domain[i];
				var regexButton = document.createElement("button");
				regexButton.innerHTML = "Delete: [" + regex + "]";
				regexButton.addEventListener("click", removeRegexWrapper(domain_key, i));
				div.appendChild(regexButton);

			}
		}
	});

}