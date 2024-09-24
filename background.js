chrome.runtime.onInstalled.addListener(function() {
  console.log('Extension installed');
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.windows.create({
    url: chrome.runtime.getURL("demand_finder.html"),
    type: "popup",
    width: 400,
    height: 600
  });
});

console.log('Background script loaded');