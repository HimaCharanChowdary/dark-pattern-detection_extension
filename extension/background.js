// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("Dark Pattern Detector installed!");
});

// Listen for detected patterns from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.type === "detectedPatterns"){
        const count = request.data.length;
        // Update badge text
        chrome.action.setBadgeText({text: count.toString()});
        chrome.action.setBadgeBackgroundColor({color: "red"});
    }
});
