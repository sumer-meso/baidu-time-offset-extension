// pageScript.js - Time Offset Extension
// Update the rendered clock and sunrise/sunset countdown without touching San data.
// Wrapped in an IIFE: top-level `function`/`let` names were colliding with globals
// declared later by Baidu's own bundle (e.g. window.formatDate got overwritten).
(function () {
    const LOG_PREFIX = '[Time Offset]';
    window.time_offset = 0;

    let timeRoot = null;
    let baselineClock = null;
    let baselineWallTime = 0;
    let eventTimes = null;
    let updateTimer = null;
    let observer = null;
    let lastUpdateTime = 0;
    const UPDATE_DEBOUNCE_MS = 100;

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

    function initialize(root) {
        if (timeRoot === root && baselineClock) {
            return true;
        }

        const clock = readDigits(root);
        if (!clock) {
            return false;
        }

        timeRoot = root;
        baselineClock = clock;
        baselineWallTime = Date.now();

        const sunrise = readEventTime(root, '[class*="sunrise"]');
        const sunset = readEventTime(root, '[class*="sunset"]');
        eventTimes = {
            sunrise,
            sunset,
            sunriseText: sunrise ? `${String(sunrise.hour).padStart(2, '0')}:${String(sunrise.minute).padStart(2, '0')}` : '',
            sunsetText: sunset ? `${String(sunset.hour).padStart(2, '0')}:${String(sunset.minute).padStart(2, '0')}` : ''
        };

        console.log(`${LOG_PREFIX} 已读取页面时钟和日出/日落时间`, {clock, sunrise, sunset});
        return true;
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
        updateCountdown(timeRoot, displayedTime);
        updateDate(timeRoot, displayedTime);
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
        console.log(`${LOG_PREFIX} 偏移量更新: ${window.time_offset}ms`);
        update();
    });

    console.log(`${LOG_PREFIX} DOM 时间更新器已启动`);
})();


