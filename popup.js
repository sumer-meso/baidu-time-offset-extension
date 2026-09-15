// popup.js
document.addEventListener('DOMContentLoaded', async () => {
    const offsetInput = document.getElementById('offsetInput');
    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const millisecondsPerHour = 60 * 60 * 1000;

    // Load current offset value
    const storage = await chrome.storage.sync.get('timeOffset');
    if (storage.timeOffset !== undefined) {
        offsetInput.value = storage.timeOffset / millisecondsPerHour;
    } else {
        offsetInput.value = 2;
    }

    // Save button click handler
    saveBtn.addEventListener('click', async () => {
        const hours = Number(offsetInput.value);
        
        if (!Number.isFinite(hours)) {
            showStatus('请输入有效的小时数', 'error');
            return;
        }

        const offset = Math.round(hours * millisecondsPerHour);

        await chrome.storage.sync.set({ timeOffset: offset });
        showStatus(`✓ 已保存 ${hours} 小时偏移`, 'success');

        // Notify all tabs about the new offset
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, 
                    { action: 'updateOffset', offset: offset },
                    () => chrome.runtime.lastError // Ignore errors for tabs that don't have content script
                );
            });
        });
    });

    // Preset buttons click handler
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            offsetInput.value = btn.dataset.hours;
            saveBtn.click();
        });
    });

    // Helper function to show status message
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        setTimeout(() => {
            statusDiv.className = 'status';
        }, 2000);
    }
});
