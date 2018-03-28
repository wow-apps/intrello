'use strict';

chrome.runtime.onInstalled.addListener(function() {
    // chrome.storage.sync.set({color: '#3aa757'}, function() {
    //     console.log('The color is green.');
    // });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.linkedin.com'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.pageAction.onClicked.addListener(function () {
    alert($("h1.pv-top-card-section__name").text());
    window.Trello.addCard(
        {
            mode: 'popup',
            name: 'Alexey Samara',
            desc: "Test description\nhttps://www.linkedin.com/in/alexey-samara/",
            source: 'https://www.linkedin.com/in/alexey-samara/'
        }
    );
});