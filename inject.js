// inject.js - Content script that loads pageScript.js into page context
(async () => {
    // Load external pageScript.js to avoid CSP inline-script restrictions
    const pageScript = document.createElement('script');
    pageScript.src = chrome.runtime.getURL('pageScript.js');
    pageScript.onload = function() {
        this.remove();

        chrome.storage.sync.get(['timeOffset', 'customSunrise', 'customSunset'], (storage) => {
            const offset = storage.timeOffset ?? 7200000;
            const customSunrise = storage.customSunrise || null;
            const customSunset = storage.customSunset || null;
            window.dispatchEvent(new CustomEvent('TimeOffsetUpdate', {
                detail: { offset, customSunrise, customSunset }
            }));
        });
    };
    pageScript.onerror = function() {
        console.error('[Time Offset] 加载 pageScript.js 失败');
    };
    (document.head || document.documentElement).appendChild(pageScript);
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateOffset') {
            // Dispatch event to page script
            window.dispatchEvent(new CustomEvent('TimeOffsetUpdate', {
                detail: {
                    offset: request.offset
                }
            }));
            sendResponse({ success: true });
        } else if (request.action === 'updateCustomTimes') {
            // Dispatch event to page script for custom times
            window.dispatchEvent(new CustomEvent('CustomTimesUpdate', {
                detail: {
                    customSunrise: request.customSunrise,
                    customSunset: request.customSunset
                }
            }));
            sendResponse({ success: true });
        }
    });
})();
