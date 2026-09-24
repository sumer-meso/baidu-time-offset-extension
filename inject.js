// inject.js - Content script that loads pageScript.js into page context
(async () => {
    // Load external pageScript.js to avoid CSP inline-script restrictions
    const pageScript = document.createElement('script');
    pageScript.src = chrome.runtime.getURL('pageScript.js');
    pageScript.onload = function() {
        this.remove();
    };
    pageScript.onerror = function() {
        console.error('[Time Offset] 加载 pageScript.js 失败');
    };
    (document.head || document.documentElement).appendChild(pageScript);
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // Only dispatch events if explicitly marked as user action to prevent auto-application
        if (!request.userAction) {
            sendResponse({ success: false });
            return;
        }
        
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
        } else if (request.action === 'updateCustomNextSunrise') {
            // Dispatch event to page script for custom next sunrise
            window.dispatchEvent(new CustomEvent('CustomNextSunriseUpdate', {
                detail: {
                    customNextSunrise: request.customNextSunrise
                }
            }));
            sendResponse({ success: true });
        }
    });
})();
