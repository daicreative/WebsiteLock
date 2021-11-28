function removeRegex(domain_key, regex_index) {
	chrome.storage.local.get(function (data) {
		data.domains[domain_key].regexes.splice(regex_index, 1);
		chrome.storage.local.set(data);
	});
	location.reload();
}

function removeRegexWrapper(domain_key, regex_index) {
	return function () {
		removeRegex(domain_key, regex_index);
	};
}

function removeDomain(domain_key) {
	chrome.storage.local.get(function (data) {
		delete data.domains[domain_key];
		chrome.storage.local.set(data);
	});
	location.reload();
}

function removeDomainWrapper(domain_key) {
	return function () {
		removeDomain(domain_key);
	};
}

function addRegexRule(domain_key, rule) {
	chrome.storage.local.get(function (data) {
		data.domains[domain_key].regexes.push(rule);
		chrome.storage.local.set(data);
	});
	location.reload();
}

function addRegexRuleWrapper(domain_key, rule) {
	return function () {
		addRegexRule(domain_key, rule.value);
	};
}

function setKeyLen(domain_key, inputLen) {
	chrome.storage.local.get(function (data) {
		data.domains[domain_key].keyLen = inputLen;
		chrome.storage.local.set(data);
	});
	location.reload();
}

function setKeyLenWrapper(domain_key, input) {
	return function () {
		setKeyLen(domain_key, parseInt(input.value));
	};
}

window.onload = function () {
	document.getElementById('domain_submit').onclick = function () {

		var value = document.getElementById('domain_text').value;
		if (value.includes("http://") || value.includes("https://")) {
			var url = new URL(value);
			var domain = url.hostname.replace("www.", "");

			chrome.storage.local.get(function (data) {
				if (data.domains[domain] == undefined) {
					// domain doesn't exist yet, okay to add
					data.domains[domain] = {};
					data.domains[domain].regexes = [];
					data.domains[domain].keyLen = 15;
					chrome.storage.local.set(data);
				}
			});
		}

		// Refresh to show on page
		location.reload();
	}


	chrome.storage.local.get(function (data) {
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

			// KeyLen setter
			var keyText = document.createElement("h3");
			keyText.innerHTML = "Set key length: ";
			div.appendChild(keyText);

			var keyLenInput = document.createElement("input");
			keyLenInput.type = "text";
			keyLenInput.value = domain.keyLen;
			keyText.appendChild(keyLenInput);

			var keyLenButton = document.createElement("button");
			keyLenButton.innerHTML = "Set Length";
			keyLenButton.addEventListener("click", setKeyLenWrapper(domain_key, keyLenInput));
			keyText.appendChild(keyLenButton);

			// List out all regex
			for (var i = 0; i < domain.regexes.length; i++) {
				var regex = domain.regexes[i];
				var regexButton = document.createElement("button");
				regexButton.innerHTML = "Delete: [" + regex + "]";
				regexButton.addEventListener("click", removeRegexWrapper(domain_key, i));
				div.appendChild(regexButton);
			}
		}
	});

}

