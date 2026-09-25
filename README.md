# Baidu Time Offset Changer

A Chrome/Edge extension that allows you to modify the time display on Baidu's time search pages (www.baidu.com). Perfect for testing time-sensitive features or simulating different time zones.

## Features

- ⏰ **Offset Time Display**: Add or subtract hours from the displayed time on Baidu pages
- 🌅 **Custom Sunrise/Sunset Times**: Override sunrise and sunset times for testing
- 🌍 **Next Sunrise Override**: Set a custom time for the next sunrise event
- 🎨 **Sun Position Chart**: Visual representation of sun/moon position based on the offset time
- 💾 **Persistent Settings**: Settings are saved across browser sessions using Chrome/Edge sync storage
- 🔄 **User Action Only**: Changes apply only when you explicitly click buttons in the popup—no auto-application on page reload

## Installation

### Chrome/Chromium Browsers
1. Clone or download this repository
2. Open `chrome://extensions/` in your browser
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the extension directory

### Microsoft Edge
1. Clone or download this repository
2. Open `edge://extensions/` in your browser
3. Enable "Developer mode" (bottom left)
4. Click "Load unpacked"
5. Select the extension directory

## Usage

1. Open Baidu time search (example: search for "current time")
2. Click the extension icon in the toolbar
3. Enter time offset (can be positive or negative):
   - `+5` to add 5 hours
   - `-3` to subtract 3 hours
   - `0` to reset to real time
4. Click "Apply Offset" to update the displayed time
5. (Optional) Expand "Custom Times" to override sunrise/sunset/next sunrise

## Technical Details

### Architecture
- **Manifest Version**: 3 (MV3)
- **Content Script**: `inject.js` - Injects `pageScript.js` into the Baidu page context
- **Page Script**: `pageScript.js` (~800 lines) - Handles time manipulation and UI updates
- **Popup**: `popup.html/js` - UI for settings
- **Storage**: Chrome/Edge `storage.sync` API for cloud sync

### Key Technologies
- Chrome/Edge Extension APIs (storage, tabs, runtime messaging)
- Canvas API for sun chart visualization
- ECharts library (via CDN) for advanced charting
- MutationObserver for DOM change detection
- Message passing with validation flags

### How It Works

1. **Initialization**: On page load, the extension reads sunrise/sunset times from Baidu's DOM
2. **User Action**: When you click a button in the popup, it sends a message with `userAction: true` flag
3. **Application**: The extension only applies changes when this flag is present, preventing auto-application on page reload
4. **Visual Updates**: 
   - Clock and countdown display the offset time
   - Sun chart visualizes the sun position at the offset time
   - Background transitions between day/twilight/night states

### Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration |
| `popup.html` | Popup UI structure |
| `popup.js` | Popup UI logic and messaging |
| `inject.js` | Content script that injects page script |
| `pageScript.js` | Main logic running in page context |
| `CODE_ANALYSIS.md` | Detailed technical documentation |

## Browser Support

- ✅ Google Chrome (latest)
- ✅ Microsoft Edge (latest)
- ✅ Chromium-based browsers (Brave, Opera, Vivaldi, etc.)

## Permissions

- `storage`: Saves your settings across sessions
- `tabs`: Sends messages to the active tab

## Host Permissions

- `*://www.baidu.com/*`: Required to inject script and modify Baidu pages

## Limitations

- Only works on Baidu time search pages (www.baidu.com)
- Custom times should be in 24-hour format (HH:MM)
- Changes apply only to the displayed time—the server still reports actual time

## Development

### Project Structure
```
time-offset-extension/
├── manifest.json           # Extension config
├── popup.html             # Popup UI
├── popup.js               # Popup logic
├── inject.js              # Content script
├── pageScript.js          # Page context logic
├── CODE_ANALYSIS.md       # Technical deep-dive
└── README.md              # This file
```

### Debugging
1. Right-click extension icon → "Inspect popup" for popup debugging
2. Open DevTools on Baidu page (F12) to see console logs
3. Check `chrome://extensions/` for errors

## License

This project is provided as-is for personal use.

## Changelog

### v1.1
- Removed auto-application logic on page reload
- Added `userAction` flag requirement for message validation
- Optimized update cycles to only redraw when needed
- Fixed race conditions with Baidu's San.js framework
- Sun chart now draws only on user action

### v1.0
- Initial release
- Core time offset functionality
- Custom times support
- Sun position visualization

## Support

For issues or feature requests, please check the extension code or contact the developer.
