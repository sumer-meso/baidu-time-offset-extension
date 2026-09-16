// popup.js
const translations = {
    zh: {
        title: '⏱️ 时间偏移设置',
        label: '时间偏移 (小时):',
        placeholder: '输入小时数，例如 2',
        hint: '正数表示快进，负数表示延后<br>• 1 表示快进 1 小时<br>• -1 表示延后 1 小时',
        expandLabel: '自定义日出/日落时间',
        sunriseLabel: '日出时间 (HH:MM, 可选):',
        sunriseHint: '输入日出时间，例如 06:00',
        sunriseHintText: '留空则使用自动检测的时间',
        sunsetLabel: '日落时间 (HH:MM, 可选):',
        sunsetHint: '输入日落时间，例如 18:00',
        sunsetHintText: '留空则使用自动检测的时间',
        saveBtn: '💾 保存设置',
        customSaveBtn: '💾 保存自定义时间',
        presetLabel: '快速预设:',
        preset0: '无偏移',
        preset1: '+1小时',
        preset2: '-5小时',
        preset3: '-9小时',
        inputPlaceholder: '输入小时数，例如 2',
        saveSuccess: '✓ 已保存 ',
        customSaveSuccess: '✓ 自定义时间已保存',
        saveError: '请输入有效的小时数',
        hoursSuffix: ' 小时偏移'
    },
    en: {
        title: '⏱️ Time Offset Settings',
        label: 'Time Offset (hours):',
        placeholder: 'Enter hours, e.g., 2',
        hint: 'Positive values advance time, negative values delay time<br>• 1 means +1 hour<br>• -1 means -1 hour',
        expandLabel: 'Custom Sunrise/Sunset Times',
        sunriseLabel: 'Sunrise Time (HH:MM, optional):',
        sunriseHint: 'Enter sunrise time, e.g., 06:00',
        sunriseHintText: 'Leave empty to use auto-detected time',
        sunsetLabel: 'Sunset Time (HH:MM, optional):',
        sunsetHint: 'Enter sunset time, e.g., 18:00',
        sunsetHintText: 'Leave empty to use auto-detected time',
        saveBtn: '💾 Save Settings',
        customSaveBtn: '💾 Save Custom Times',
        presetLabel: 'Quick Presets:',
        preset0: 'No Offset',
        preset1: '+1 Hour',
        preset2: '-5 Hours',
        preset3: '-9 Hours',
        inputPlaceholder: 'Enter hours, e.g., 2',
        saveSuccess: '✓ Saved ',
        customSaveSuccess: '✓ Custom times saved',
        saveError: 'Please enter a valid hour value',
        hoursSuffix: ' hour offset'
    }
};

// Detect browser language
function getLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    // Check if it's Chinese (mainland, Taiwan, Hong Kong, etc.)
    if (browserLang.startsWith('zh')) {
        return 'zh';
    }
    return 'en';
}

// Apply translations to the page
function applyTranslations(lang) {
    const t = translations[lang];

    // Translate elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            if (key === 'hint') {
                // Special handling for hint with HTML content
                element.innerHTML = t[key];
            } else if (element.tagName === 'INPUT') {
                // For input elements, set placeholder
                element.placeholder = t[key];
            } else {
                // For regular elements, set textContent
                element.textContent = t[key];
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const lang = getLanguage();
    applyTranslations(lang);

    const offsetInput = document.getElementById('offsetInput');
    const sunriseInput = document.getElementById('sunriseInput');
    const sunsetInput = document.getElementById('sunsetInput');
    const saveBtn = document.getElementById('saveBtn');
    const customTimesSaveBtn = document.getElementById('customTimesSaveBtn');
    const expandBtn = document.getElementById('expandBtn');
    const collapsibleSection = document.getElementById('collapsibleSection');
    const statusDiv = document.getElementById('status');
    const customStatusDiv = document.getElementById('customStatus');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const millisecondsPerHour = 60 * 60 * 1000;
    const t = translations[lang];

    // Load current values from storage
    const storage = await chrome.storage.sync.get(['timeOffset', 'customSunrise', 'customSunset']);

    if (storage.timeOffset !== undefined) {
        offsetInput.value = storage.timeOffset / millisecondsPerHour;
    } else {
        offsetInput.value = 2;
    }

    if (storage.customSunrise) {
        sunriseInput.value = storage.customSunrise;
    }

    if (storage.customSunset) {
        sunsetInput.value = storage.customSunset;
    }

    // Expand/collapse button handler
    expandBtn.addEventListener('click', () => {
        expandBtn.classList.toggle('expanded');
        collapsibleSection.classList.toggle('visible');
    });

    // Save button click handler - ONLY saves offset
    saveBtn.addEventListener('click', async () => {
        const hours = Number(offsetInput.value);
        
        if (!Number.isFinite(hours)) {
            showStatus(t.saveError, 'error', statusDiv);
            return;
        }

        const offset = Math.round(hours * millisecondsPerHour);

        await chrome.storage.sync.set({
            timeOffset: offset
        });

        showStatus(`${t.saveSuccess}${hours}${t.hoursSuffix}`, 'success', statusDiv);

        // Notify only Baidu time search tabs about the new offset
        chrome.tabs.query({ url: "*://www.baidu.com/*" }, (tabs) => {
            // Filter to only tabs with wd=%E6%97%B6%E9%97%B4 in the query string
            const filteredTabs = tabs.filter(tab => tab.url && tab.url.includes('wd=%E6%97%B6%E9%97%B4'));
            const skippedTabs = tabs.length - filteredTabs.length;

            if (skippedTabs > 0) {
                console.log(`[Time Offset Popup] Skipping ${skippedTabs} non-time-search tabs`);
            }
            console.log(`[Time Offset Popup] Sending offset update to ${filteredTabs.length} time-search tabs`);

            filteredTabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id,
                    {
                        action: 'updateOffset',
                        offset: offset
                    },
                    (response) => {
                        // Ignore errors - tabs may have been closed
                        if (chrome.runtime.lastError) {
                            // Silently ignore
                        }
                    }
                );
            });
        });
    });

    // Custom times save button handler - saves custom sunrise/sunset
    customTimesSaveBtn.addEventListener('click', async () => {
        const customSunrise = sunriseInput.value && sunriseInput.value.trim() ? sunriseInput.value : null;
        const customSunset = sunsetInput.value && sunsetInput.value.trim() ? sunsetInput.value : null;

        await chrome.storage.sync.set({
            customSunrise: customSunrise,
            customSunset: customSunset
        });

        showStatus(t.customSaveSuccess, 'success', customStatusDiv);

        // Notify only Baidu time search tabs about the new custom times
        chrome.tabs.query({ url: "*://www.baidu.com/*" }, (tabs) => {
            // Filter to only tabs with wd=%E6%97%B6%E9%97%B4 in the query string
            const filteredTabs = tabs.filter(tab => tab.url && tab.url.includes('wd=%E6%97%B6%E9%97%B4'));
            const skippedTabs = tabs.length - filteredTabs.length;

            if (skippedTabs > 0) {
                console.log(`[Time Offset Popup] Skipping ${skippedTabs} non-time-search tabs`);
            }
            console.log(`[Time Offset Popup] Sending custom times update to ${filteredTabs.length} time-search tabs`);

            filteredTabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id,
                    {
                        action: 'updateCustomTimes',
                        customSunrise: customSunrise,
                        customSunset: customSunset
                    },
                    (response) => {
                        // Ignore errors - tabs may have been closed
                        if (chrome.runtime.lastError) {
                            // Silently ignore
                        }
                    }
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
    function showStatus(message, type, statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
        setTimeout(() => {
            statusElement.className = 'status';
        }, 2000);
    }
});
