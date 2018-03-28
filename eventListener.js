'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.linkedin.com'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.pageAction.onClicked.addListener(function (tab) {
    if (tab.url.indexOf("https://www.linkedin.com/in/") != -1) {
        chrome.tabs.executeScript(tab.id, {
            "file": "lib/jquery-3.3.1.min.js"
        }, function () {
            console.log("jquery-3.3.1.min.js Executed .. ");
        });
        chrome.tabs.executeScript(tab.id, {
            "file": "in_trello.js"
        }, function () {
            console.log("inTrello Executed .. ");
        });
    }
});
