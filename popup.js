function clickHandler(e) {
    chrome.tabs.create({
        url: "options.html"
    });
    window.close(); // Note: window.close(), not this.close()
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('click-me').addEventListener('click', clickHandler);
    document.getElementById('delete').onclick = function () {
        chrome.storage.sync.clear();
        chrome.storage.sync.set({'domains': {}});
    }
});