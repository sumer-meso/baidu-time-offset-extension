// inject.js - Content script that loads pageScript.js into page context
(async () => {
    console.log('[Time Offset] 内容脚本已加载');
    
    // Load external pageScript.js to avoid CSP inline-script restrictions
    const pageScript = document.createElement('script');
    pageScript.src = chrome.runtime.getURL('pageScript.js');
    pageScript.onload = function() {
        console.log('[Time Offset] pageScript.js 已成功注入');
        this.remove();

        chrome.storage.sync.get('timeOffset', (storage) => {
            const offset = storage.timeOffset ?? 7200000;
            window.dispatchEvent(new CustomEvent('TimeOffsetUpdate', {
                detail: { offset }
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
                detail: { offset: request.offset }
            }));
            sendResponse({ success: true });
        }
    });
})();
