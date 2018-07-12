/**
 * inTrello - extension for Google Chrome
 * @package https://github.com/wow-apps/intrello
 * @copyright wow-apps <https://wow-apps.pro/>
 * @author Alexey Samara <lion.samara@gmail.com>
 * @licence Apache License 2
 */
'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules(
            [
                {
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher({
                            pageUrl: {hostEquals: 'www.linkedin.com'},
                        })
                    ],
                    actions: [new chrome.declarativeContent.ShowPageAction()]
                },
                {
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher({
                            pageUrl: {
                                hostEquals: 'trello.com',
                                urlContains: 'add-card?'
                            },
                        })
                    ],
                    actions: [new chrome.declarativeContent.ShowPageAction()]
                }
            ]
        );
    });
});

chrome.pageAction.onClicked.addListener(function (tab) {
    if (tab.status !== 'complete' || tab.url.indexOf("https://www.linkedin.com/in/") == -1) {
        return false;
    }
    
    chrome.tabs.sendMessage(
        tab.id,
        {
            appKey: '4d00dbae7c9180ebf7628bd73c8af823',
            appMode: 'popup',
            tab: tab
        }
    );
});
