// pageScript.js - Time Offset Extension
// Update the rendered clock and sunrise/sunset countdown without touching San data.
// Wrapped in an IIFE: top-level `function`/`let` names were colliding with globals
// declared later by Baidu's own bundle (e.g. window.formatDate got overwritten).
(function () {
    // Only run on Baidu time search results page (wd=时间)
    if (!window.location.href.includes('wd=%E6%97%B6%E9%97%B4')) {
        console.log('[Time Offset] Skipping - not a Baidu time search page. URL:', window.location.href);
        return;
    }

    console.log('[Time Offset] Initializing on Baidu time search page');

    const LOG_PREFIX = '[Time Offset]';
    window.time_offset = 0;
    let customSunrise = null;  // Custom sunrise time in HH:MM format
    let customSunset = null;   // Custom sunset time in HH:MM format
    let autoDetectedSunrise = null;  // Store auto-detected sunrise for fallback
    let autoDetectedSunset = null;   // Store auto-detected sunset for fallback
    let currentDayNightMode = null;  // Track current day/night mode to detect switches

    let timeRoot = null;
    let baselineClock = null;
    let baselineWallTime = 0;
    let eventTimes = null;
    let updateTimer = null;
    let observer = null;
    let lastUpdateTime = 0;
    const UPDATE_DEBOUNCE_MS = 100;
    let sunCanvas = null;
    let savedBaselineClock = null;  // Used to preserve baseline during custom time reinitialization
    const markerImages = {};
    const sunImageUrl = 'https://gips2.baidu.com/it/u=3376438528,1179003902&fm=3028&app=3028&f=PNG&fmt=auto&q=75&size=f72_72';
    const moonImageUrl = 'https://gips1.baidu.com/it/u=2315833618,1537777767&fm=3028&app=3028&f=PNG&fmt=auto&q=75&size=f72_72';

    function readDigits(root) {
        const digits = [...root.querySelectorAll('[class*="time-text"]')]
            .map(element => element.textContent.trim())
            .filter(value => /^\d{1,2}$/.test(value));

        if (digits.length < 6) {
            return null;
        }

        const hour = Number(digits[0]);
        const minute = Number(digits[2]);
        const second = Number(digits[4]);
        if (hour > 23 || minute > 59 || second > 59) {
            return null;
        }
        return {hour, minute, second};
    }

    function readEventTime(root, selector) {
        const element = root.querySelector(selector);
        const match = element?.textContent.match(/(\d{1,2}):(\d{2})/);
        if (!match) {
            return null;
        }
        return {hour: Number(match[1]), minute: Number(match[2])};
    }

    function toDate(baseDate, clock) {
        const date = new Date(baseDate);
        date.setHours(clock.hour, clock.minute, clock.second || 0, 0);
        return date;
    }

    function formatClock(date) {
        return [date.getHours(), date.getMinutes(), date.getSeconds()]
            .map(value => String(value).padStart(2, '0'));
    }

    function formatRemaining(milliseconds) {
        const totalMinutes = Math.max(0, Math.ceil(milliseconds / 60000));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}小时${String(minutes).padStart(2, '0')}分`;
    }

    function formatIsoDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatWeek(date) {
        return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
    }

    function findCountdown(root) {
        return [...root.querySelectorAll('[class*="desc"] div')]
            .find(element => /^(日出|日落|下一个日出)/.test(element.textContent.trim())) || null;
    }

    function updateClock(root, date) {
        const digits = formatClock(date);
        const elements = [...root.querySelectorAll('[class*="time-text"]')];

        for (let group = 0; group < 3; group++) {
            const value = digits[group];
            const first = elements[group * 2];
            const second = elements[group * 2 + 1];

            if (first && first.textContent.trim() !== value) {
                first.textContent = value;
            }
            if (second && second.textContent.trim() !== value) {
                second.textContent = value;
            }
        }
    }

    function updateCountdown(root, displayedTime) {
        if (!eventTimes) {
            return;
        }

        const countdown = findCountdown(root);
        if (!countdown) {
            return;
        }

        const now = new Date(displayedTime);
        // Re-anchor sunrise/sunset to the displayed calendar date every tick,
        // so a large offset that shifts the date doesn't misalign the countdown.
        const sunriseToday = eventTimes.sunrise ? toDate(now, eventTimes.sunrise) : null;
        const sunsetToday = eventTimes.sunset ? toDate(now, eventTimes.sunset) : null;

        let event = sunriseToday;
        let label = '日出';
        let labelTime = eventTimes.sunriseText;

        if (event && now >= event) {
            event = sunsetToday;
            label = '日落';
            labelTime = eventTimes.sunsetText;
        }
        if (event && now >= event && sunriseToday) {
            event = new Date(sunriseToday.getTime() + 24 * 60 * 60 * 1000);
            label = '下一个日出';
            labelTime = eventTimes.sunriseText;
        }
        if (!event) {
            return;
        }

        const remaining = event.getTime() - now.getTime();
        const action = remaining >= 0 ? '还有' : '已过';
        const text = `${label}${labelTime || ''}${action}${formatRemaining(Math.abs(remaining))}`;
        if (countdown.textContent.trim() !== text) {
            countdown.textContent = text;
        }
    }

    function updateDate(root, displayedTime) {
        const dateText = formatIsoDate(displayedTime);
        const weekText = formatWeek(displayedTime);

        const dateBlock = root.querySelector('[class*="date"]');
        const dateElement = dateBlock?.children[0] || [...root.querySelectorAll('div')]
            .find(element => /^\d{4}-?\d{2}-?\d{2}$/.test(element.textContent.trim()));
        const weekElement = dateBlock?.children[1] || [...root.querySelectorAll('div')]
            .find(element => /^星期[一二三四五六日]$/.test(element.textContent.trim()));

        if (!dateElement) {
            return;
        }

        if (dateElement.textContent.trim() !== dateText) {
            dateElement.textContent = dateText;
        }
        if (weekElement && weekElement.textContent.trim() !== weekText) {
            weekElement.replaceChildren(document.createTextNode(weekText));
        }
    }

    function updateBackground(root, displayedTime) {
        if (!eventTimes?.sunrise || !eventTimes?.sunset) {
            return;
        }

        const currentHour = displayedTime.getHours() + displayedTime.getMinutes() / 60;
        const sunriseHour = eventTimes.sunrise.hour + eventTimes.sunrise.minute / 60;
        const sunsetHour = eventTimes.sunset.hour + eventTimes.sunset.minute / 60;

        const isDaytime = currentHour >= sunriseHour && currentHour < sunsetHour;

        // Find the specific wrapper div that is a direct child or close descendant of root
        // This should be the one with class containing "wrapper" and the background image
        const wrapper = root.querySelector('[class*="wrapper_"]') || root.parentElement?.querySelector('[class*="wrapper_"]');

        if (!wrapper) {
            return;
        }

        if (!wrapper.style.backgroundImage) {
            return;
        }

        // Use data attributes to track the current mode
        const currentMode = wrapper.getAttribute('data-time-mode');
        const newMode = isDaytime ? 'day' : 'night';

        if (currentMode === newMode) {
            return; // No change needed
        }

        wrapper.setAttribute('data-time-mode', newMode);

        // Change background image based on time of day
        if (isDaytime) {
            // Daytime background image
            wrapper.style.backgroundImage = 'url(https://gips0.baidu.com/it/u=567037999,4238421755&fm=3028&app=3028&f=PNG&fmt=auto&q=75&size=f1184_845)';
        } else {
            // Nighttime background image
            wrapper.style.backgroundImage = 'url(https://gips3.baidu.com/it/u=1743996582,3792202273&fm=3028&app=3028&f=PNG&fmt=auto&q=75&size=f1184_840)';
        }

        // Update the linear-gradient overlay elements
        const topGradient = wrapper.querySelector('linear-gradient[class*="top_"]');
        const bottomGradient = wrapper.querySelector('linear-gradient[class*="bottom_"]');

        if (isDaytime) {
            // Daytime gradients - blue tones matching Baidu's actual style
            if (topGradient) {
                topGradient.setAttribute('style', 'background-image: linear-gradient(#4887E6 10%, rgba(72, 135, 230, 0)) !important;');
            }
            if (bottomGradient) {
                bottomGradient.setAttribute('style', 'background-image: linear-gradient(rgba(37, 97, 188, 0), #4887E6 90%) !important;');
            }
        } else {
            // Nighttime gradients - dark, cool tones
            if (topGradient) {
                topGradient.setAttribute('style', 'background-image: linear-gradient(#0A1C20 10%, rgba(10, 28, 32, 0)) !important;');
            }
            if (bottomGradient) {
                bottomGradient.setAttribute('style', 'background-image: linear-gradient(rgba(17, 44, 52, 0), #112C34 90%) !important;');
            }
        }
    }

    function getChartCanvas(root) {
        return root.querySelector('[data-zr-dom-id]') || root.querySelector('canvas');
    }

    function ensureSunCanvas(root) {
        const chartCanvas = getChartCanvas(root);
        if (!chartCanvas || !chartCanvas.parentElement) {
            return null;
        }

        if (sunCanvas && sunCanvas.isConnected) {
            return sunCanvas;
        }

        sunCanvas = document.createElement('canvas');
        sunCanvas.width = chartCanvas.width;
        sunCanvas.height = chartCanvas.height;
        sunCanvas.style.cssText = [
            'position: absolute',
            'left: 0px',
            'top: 0px',
            'width: ' + chartCanvas.width + 'px',
            'height: ' + chartCanvas.height + 'px',
            'user-select: none',
            '-webkit-tap-highlight-color: rgba(0, 0, 0, 0)',
            'padding: 0px',
            'margin: 0px',
            'border-width: 0px',
            'pointer-events: none',
            'z-index: 2'
        ].join('; ');
        chartCanvas.style.visibility = 'hidden';
        chartCanvas.parentElement.style.position = 'relative';
        chartCanvas.parentElement.appendChild(sunCanvas);
        return sunCanvas;
    }

    function drawSunChart(root, displayedTime) {
        const canvas = ensureSunCanvas(root);
        if (!canvas || !eventTimes?.sunrise || !eventTimes?.sunset) {
            return;
        }

        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const sunriseHour = eventTimes.sunrise.hour + eventTimes.sunrise.minute / 60;
        const sunsetHour = eventTimes.sunset.hour + eventTimes.sunset.minute / 60;
        const currentHour = displayedTime.getHours()
            + displayedTime.getMinutes() / 60
            + displayedTime.getSeconds() / 3600;
        let position;

        if (currentHour < sunriseHour) {
            position = currentHour / sunriseHour * 6;
        } else if (currentHour < sunsetHour) {
            position = (currentHour - sunriseHour) / (sunsetHour - sunriseHour) * 12 + 6;
        } else {
            position = (currentHour - sunsetHour) / (24 - sunsetHour) * 6 + 18;
        }

        const toX = hour => hour / 24 * width;
        const toY = value => (0.7 - value) / 1.4 * height;
        const curveY = value => 0.5 * Math.sin(Math.PI / 12 * (value - 6));

        context.clearRect(0, 0, width, height);

        // ECharts uses a smooth line with the day color mapped across the curve.
        const drawSegment = (from, to, strokeStyle, lineWidth = 1) => {
            context.beginPath();
            for (let hour = from; hour <= to; hour += 0.1) {
                const x = toX(hour);
                const y = toY(curveY(hour));
                if (hour === from) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }
            }
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
            context.stroke();
        };

        drawSegment(0, 24, 'rgba(255, 255, 255, 0.10)', 2);

        const baselineGradient = context.createLinearGradient(0, 0, width, 0);
        baselineGradient.addColorStop(0, 'rgba(255, 240, 161, 0)');
        baselineGradient.addColorStop(0.36, 'rgba(255, 255, 255, 1)');
        baselineGradient.addColorStop(0.46, '#ffffff');
        baselineGradient.addColorStop(0.54, '#ffffff');
        baselineGradient.addColorStop(0.64, 'rgba(255, 255, 255, 1)');
        baselineGradient.addColorStop(1, 'rgba(255, 240, 161, 0)');
        const daytimeGradient = context.createLinearGradient(toX(sunriseHour), 0, toX(sunsetHour), 0);
        daytimeGradient.addColorStop(0, 'rgba(255, 240, 161, 0.10)');
        daytimeGradient.addColorStop(0.18, 'rgba(255, 240, 161, 0.28)');
        daytimeGradient.addColorStop(0.36, '#FFF0A1');
        daytimeGradient.addColorStop(0.64, '#FFF0A1');
        daytimeGradient.addColorStop(0.82, 'rgba(255, 240, 161, 0.28)');
        daytimeGradient.addColorStop(1, 'rgba(255, 240, 161, 0.10)');
        drawSegment(sunriseHour, sunsetHour, daytimeGradient, 2);

        context.save();
        context.setLineDash([5, 2]);
        context.beginPath();
        context.moveTo(0, toY(0));
        context.lineTo(width, toY(0));
        context.strokeStyle = baselineGradient;
        context.lineWidth = 0.7;
        context.stroke();
        context.restore();

        const drawPoint = (hour, color) => {
            context.beginPath();
            context.arc(toX(hour), toY(curveY(hour)), 2, 0, Math.PI * 2);
            context.fillStyle = color;
            context.fill();
        };

        drawPoint(6, '#FBB575');
        drawPoint(18, '#8EA5F9');

        const markerX = toX(position);
        const markerY = toY(curveY(position));
        const isDay = currentHour >= sunriseHour && currentHour < sunsetHour;
        const markerKey = isDay ? 'sun' : 'moon';
        const markerUrl = isDay ? sunImageUrl : moonImageUrl;
        const marker = markerImages[markerKey] || (markerImages[markerKey] = new Image());
        if (!marker.src) {
            marker.onload = () => drawSunChart(root, displayedTime);
            marker.src = markerUrl;
        } else if (marker.complete) {
            // Clamp marker position to prevent cutoff at edges (marker is 24x24, drawn with 12px offset)
            const clampedMarkerX = Math.max(20, Math.min(width - 20, markerX));
            context.drawImage(marker, clampedMarkerX - 12, markerY - 12, 24, 24);
        }
    }

    function initialize(root) {
        if (timeRoot === root && baselineClock) {
            return true;
        }

        let clock;
        if (savedBaselineClock) {
            // Use the saved baseline to avoid applying offset twice when reinitializing
            clock = savedBaselineClock;
            savedBaselineClock = null;  // Clear after use
        } else {
            // Read from DOM for normal initialization
            clock = readDigits(root);
        }

        if (!clock) {
            return false;
        }

        timeRoot = root;
        baselineClock = clock;
        baselineWallTime = Date.now();

        let sunrise = readEventTime(root, '[class*="sunrise"]');
        let sunset = readEventTime(root, '[class*="sunset"]');

        // Store the auto-detected values for fallback (only on first initialization)
        if (!autoDetectedSunrise) {
            autoDetectedSunrise = sunrise;
            autoDetectedSunset = sunset;
        }

        // Use custom times if provided, otherwise fall back to auto-detected or DOM values
        if (customSunrise) {
            const [hour, minute] = customSunrise.split(':');
            sunrise = {hour: Number(hour), minute: Number(minute)};
        } else if (autoDetectedSunrise) {
            // If custom sunrise is null/cleared, use the original auto-detected value
            sunrise = autoDetectedSunrise;
        }
    
        if (customSunset) {
            const [hour, minute] = customSunset.split(':');
            sunset = {hour: Number(hour), minute: Number(minute)};
        } else if (autoDetectedSunset) {
            // If custom sunset is null/cleared, use the original auto-detected value
            sunset = autoDetectedSunset;
        }

        eventTimes = {
            sunrise,
            sunset,
            sunriseText: sunrise ? `${String(sunrise.hour).padStart(2, '0')}:${String(sunrise.minute).padStart(2, '0')}` : '',
            sunsetText: sunset ? `${String(sunset.hour).padStart(2, '0')}:${String(sunset.minute).padStart(2, '0')}` : ''
        };

        updateEventTimeDisplay(root);
        return true;
    }

    function updateEventTimeDisplay(root) {
        // Update the sunrise/sunset time displays (日出HH:MM, 日落HH:MM)
        if (!eventTimes?.sunrise || !eventTimes?.sunset) {
            return;
        }

        // Find and update sunrise time display
        const sunriseElement = root.querySelector('[class*="sunrise"]');
        if (sunriseElement) {
            const newText = `日出${eventTimes.sunriseText}`;
            if (sunriseElement.textContent.trim() !== newText) {
                sunriseElement.textContent = newText;
            }
        }

        // Find and update sunset time display
        const sunsetElement = root.querySelector('[class*="sunset"]');
        if (sunsetElement) {
            const newText = `日落${eventTimes.sunsetText}`;
            if (sunsetElement.textContent.trim() !== newText) {
                sunsetElement.textContent = newText;
            }
        }
    }

    function isDaytimeNow(displayedTime) {
        if (!eventTimes?.sunrise || !eventTimes?.sunset) {
            return null;
        }
        const currentHour = displayedTime.getHours() + displayedTime.getMinutes() / 60;
        const sunriseHour = eventTimes.sunrise.hour + eventTimes.sunrise.minute / 60;
        const sunsetHour = eventTimes.sunset.hour + eventTimes.sunset.minute / 60;
        return currentHour >= sunriseHour && currentHour < sunsetHour;
    }

    function update() {
        if (!timeRoot || !baselineClock) {
            return;
        }
        if (!timeRoot.isConnected) {
            timeRoot = null;
            baselineClock = null;
            findAndStart();
            return;
        }

        // Debounce rapid update calls to prevent San.js function wrapping issues
        const now = Date.now();
        if (now - lastUpdateTime < UPDATE_DEBOUNCE_MS) {
            return;
        }
        lastUpdateTime = now;

        const baseDate = new Date();
        const base = toDate(baseDate, baselineClock);
        const elapsed = Date.now() - baselineWallTime;
        const displayedTime = new Date(base.getTime() + elapsed + Number(window.time_offset || 0));

        updateClock(timeRoot, displayedTime);
        updateDate(timeRoot, displayedTime);
        updateEventTimeDisplay(timeRoot);
        drawSunChart(timeRoot, displayedTime);

        // Only update countdown when switching from night to day (sunrise)
        // Skip updates at midnight, unless triggered by popup changes
        const isDaytime = isDaytimeNow(displayedTime);
        const hour = displayedTime.getHours();

        if (isDaytime !== currentDayNightMode) {
            // Only update if transitioning to daytime (night → day/sunrise)
            // and NOT at midnight
            if (isDaytime === true && hour !== 0) {
                updateCountdown(timeRoot, displayedTime);
            }
            currentDayNightMode = isDaytime;
        }
    }

    function findAndStart() {
        const root = document.querySelector('[tpl="world_time_san"]');
        if (!root || !initialize(root)) {
            return;
        }
        if (!updateTimer) {
            updateTimer = setInterval(update, 1000);
        }
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        update();
    }

    observer = new MutationObserver(findAndStart);
    observer.observe(document.documentElement, {childList: true, subtree: true});
    findAndStart();

    window.addEventListener('TimeOffsetUpdate', event => {
        window.time_offset = Number(event.detail.offset) || 0;
        // Reset day/night mode tracking to force background update
        currentDayNightMode = null;
        update();
        if (timeRoot) {
            const baseDate = new Date();
            const base = toDate(baseDate, baselineClock);
            const elapsed = Date.now() - baselineWallTime;
            const displayedTime = new Date(base.getTime() + elapsed + Number(window.time_offset || 0));
            updateBackground(timeRoot, displayedTime);
        }
    });

    window.addEventListener('CustomTimesUpdate', event => {
        const newCustomSunrise = event.detail.customSunrise || null;
        const newCustomSunset = event.detail.customSunset || null;

        // Check if custom sunrise/sunset changed
        if (newCustomSunrise !== customSunrise || newCustomSunset !== customSunset) {
            customSunrise = newCustomSunrise;
            customSunset = newCustomSunset;

            // Reinitialize to recalculate eventTimes with new custom values
            if (timeRoot) {
                // Before reinitializing, save the original baseline (without offset)
                const elapsed = Date.now() - baselineWallTime;
                const baseDate = new Date();
                const base = toDate(baseDate, baselineClock);
                const realCurrentTime = new Date(base.getTime() + elapsed);

                // Convert back to {hour, minute, second} format
                savedBaselineClock = {
                    hour: realCurrentTime.getHours(),
                    minute: realCurrentTime.getMinutes(),
                    second: realCurrentTime.getSeconds()
                };

                timeRoot = null;
                baselineClock = null;
                // Reset day/night mode tracking to force background update
                currentDayNightMode = null;
                findAndStart();

                // Update background after reinitializing
                const newBaseDate = new Date();
                const newBase = toDate(newBaseDate, baselineClock);
                const newElapsed = Date.now() - baselineWallTime;
                const displayedTime = new Date(newBase.getTime() + newElapsed + Number(window.time_offset || 0));
                updateBackground(timeRoot, displayedTime);
            }
        }

        update();
    });
})();


