// background.js - Service Worker
chrome.runtime.onInstalled.addListener(() => {
    // Set default offset value when extension is installed
    chrome.storage.sync.get('timeOffset', (storage) => {
        if (storage.timeOffset === undefined) {
            chrome.storage.sync.set({ timeOffset: 7200000 }); // Default: 2 hours
        }
    });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getOffset') {
        chrome.storage.sync.get('timeOffset', (storage) => {
            sendResponse({ offset: storage.timeOffset ?? 7200000 });
        });
        return true; // Will respond asynchronously
    }
});
