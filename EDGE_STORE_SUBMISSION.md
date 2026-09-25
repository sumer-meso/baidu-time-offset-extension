# Microsoft Edge Add-ons Store Submission

## Store Listing Details

### Short Description (132 characters max)
```
Modify time display on Baidu search pages. Add/subtract hours, customize sunrise/sunset times, and view sun position charts.
```

### Full Description
```
Baidu Time Offset Changer - A powerful extension for testing time-sensitive features on Baidu's time search pages.

KEY FEATURES:
• Offset Time Display: Add or subtract any number of hours from the displayed time
• Custom Times: Override sunrise, sunset, and next sunrise times
• Sun Chart: Beautiful visualization showing sun/moon position at the offset time
• Cloud Sync: Your settings persist across all your devices with Microsoft account sync
• User Action Only: Changes apply only when you click buttons—no auto-application

PERFECT FOR:
• Testing time-sensitive code and features
• Simulating different time zones
• Debugging time-related functionality
• Educational and development purposes

HOW TO USE:
1. Click the extension icon on Baidu time search pages
2. Enter a time offset (e.g., +5 for 5 hours forward, -3 for 3 hours back)
3. Click "Apply Offset" to see the changes
4. Optionally customize sunrise/sunset times for advanced testing

TECHNICAL DETAILS:
• Manifest Version 3 (MV3) - Latest security standard
• Lightweight and efficient
• Works seamlessly across Edge devices
• Synced with Microsoft account

PERMISSIONS:
• storage: To save your settings
• tabs: To communicate with the page

Fully compatible with Microsoft Edge on Windows, Mac, Android, and iOS.
```

### Language
- English (en-US)

### Category
- Productivity

### Screenshots (minimum 1 required, maximum 5)
Screenshots should be:
- Minimum 320×480 pixels
- Maximum 1920×1440 pixels
- Recommended: 1280×800 pixels
- PNG or JPEG format
- No watermarks or branding

Suggested screenshots:
1. Main popup with time offset control
2. Baidu page showing offset time applied
3. Custom times section expanded
4. Sun chart visualization
5. Settings being synced across devices (conceptual)

### Icon/Logo
- 128×128 pixels minimum
- PNG, JPEG, or GIF
- Should represent time/clock/productivity

### Publisher Name
[Your name or company name]

### Publisher Website
[Link to your website or GitHub repo]

### Support Email
[Your support email]

### Support Website
[Link to documentation or GitHub issues]

### Privacy Policy
```
This extension does not collect, store, or transmit any personal user data beyond what is necessary for functionality.

Data stored locally:
- Time offset preferences (stored in Edge's sync storage)
- Custom sunrise/sunset times (stored in Edge's sync storage)

Local storage only:
- Settings are stored only on your current browser device
- No cloud sync, no device synchronization
- Settings are not shared across your Edge devices

The extension only modifies the display on Baidu.com pages and does not send any data to external servers or analytics services.

No tracking, no analytics, no ads, no profiling.
```

### Maturity Rating
- General Audience (G)

### Country/Region Availability
- Available in all regions (or specify if limited)

### Does your extension collect user data?
- No personal data collection
- Preferences stored locally only

### Does your extension contain offensive content?
- No

### Does your extension contain ads?
- No

### Does your extension require special hardware or software?
- No

### Will your extension work on all Edge devices?
- Yes (Windows 10+, macOS, iOS, Android)

---

## Submission Checklist for Microsoft Edge

- [ ] Extension tested on Edge latest version (Windows)
- [ ] Extension tested on Edge latest version (macOS) - *if available*
- [ ] All required permissions justified in description
- [ ] No warnings or errors in edge://extensions/
- [ ] Privacy policy drafted and comprehensive
- [ ] Screenshots prepared (320×480 min, 1920×1440 max)
- [ ] Icon prepared (128×128 min, PNG/JPEG/GIF)
- [ ] Code reviewed for Edge compatibility
- [ ] manifest.json properly formatted
- [ ] No deprecated APIs or Chrome-only features
- [ ] Create account on Partner Center (partner.microsoft.com)
- [ ] No suspicious or malicious code
- [ ] Clear description of functionality
- [ ] Support contact provided
- [ ] Accept Microsoft Edge Add-ons program policies
- [ ] Privacy policy accepted
- [ ] Upload extension ZIP file
- [ ] Complete all store listing fields
- [ ] Review content requirements satisfied
- [ ] Submit for review

---

## Edge-Specific Considerations

### Manifest Compatibility
✅ Your manifest.json is fully compatible with Edge:
- Manifest V3 is the standard
- All APIs used (`chrome.*` namespace) work identically in Edge
- `chrome.storage.sync` syncs with Microsoft account instead of Google account
- `chrome.tabs` works the same

### No Additional Changes Needed
- Your code requires no modifications for Edge
- All CSS and JavaScript are Edge-compatible
- No Edge-specific APIs are required

### Testing on Edge
1. Open `edge://extensions/`
2. Enable "Developer mode" (bottom left toggle)
3. Click "Load unpacked"
4. Select your extension directory
5. Test all functionality

---

## Packaging for Submission

### Create ZIP File
```bash
# From the extension directory
zip -r time-offset-extension.zip \
  manifest.json \
  popup.html \
  popup.js \
  inject.js \
  pageScript.js \
  icons/ (if you have them)
```

### Files to Include
- manifest.json ✓
- popup.html ✓
- popup.js ✓
- inject.js ✓
- pageScript.js ✓
- Any image/icon files
- Code files ONLY - no .git directory, node_modules, or build artifacts

---

## Submission Process

1. **Create Partner Center Account**
   - Go to partner.microsoft.com
   - Sign in with Microsoft account
   - Complete publisher profile

2. **Create New Extension Entry**
   - In Partner Center → Extensions
   - Click "New extension"
   - Fill in store listing details

3. **Upload Extension**
   - Provide ZIP file of your extension
   - Verify manifest.json is detected correctly

4. **Fill Store Listing**
   - Description (use the text from above)
   - Screenshots (upload 2-5 high-quality images)
   - Icon (upload your extension icon)
   - Category: Productivity
   - Language: English
   - Privacy policy (use the text from above)

5. **Review Policies**
   - Accept Microsoft Edge Add-ons catalog policies
   - Accept privacy policy requirements
   - Confirm no restricted content

6. **Submit for Review**
   - Click "Submit" button
   - Receive confirmation email
   - Review typically takes 24-48 hours

7. **Monitor Status**
   - Check Partner Center regularly
   - Email notifications sent during review
   - Once approved, automatically published

---

## Post-Submission

### Review Status
- Typically reviewed within 24-48 hours
- Most extensions approved on first submission
- If rejected, follow the feedback and resubmit

### Updates
- Increment `version` in manifest.json
- Repackage as ZIP
- Upload new version in Partner Center
- Provide update description/notes
- Usually faster review for updates (4-24 hours)

### Extension Listing
Once approved:
- Listed on Microsoft Edge Add-ons website
- Searchable in Edge browser
- Included in Edge on Windows, macOS, Android, iOS
- Settings sync across all Edge devices via Microsoft account

### Support and Maintenance
- Monitor user reviews
- Respond to user feedback
- Fix bugs promptly
- Add features based on user requests
- Keep extension updated for Edge compatibility

---

## Additional Resources

- **Microsoft Partner Center**: https://partner.microsoft.com
- **Edge Add-ons Program**: https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home
- **Extension Development Docs**: https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/
- **Manifest V3 Guide**: https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/manifest-format-overview

---

## FAQ

**Q: Do I need different code for Chrome and Edge?**
A: No! The same code works on both. The `chrome.*` namespace is now standard across Chromium browsers, including Edge.

**Q: Will my Chrome extension automatically work on Edge?**
A: Yes, but you need to submit it separately to the Edge Add-ons store. It won't be automatically available.

**Q: Can users install the Chrome version on Edge?**
A: Yes, users can install extensions from the Chrome Web Store on Edge by enabling "Allow extensions from other stores" in settings.

**Q: Is there a fee to submit to Edge?**
A: Edge Add-ons store is free to submit to (unlike Chrome which charges $5). No registration fee.

**Q: How long before my extension is approved?**
A: Typically 24-48 hours for new submissions, 4-24 hours for updates.

**Q: Can I submit the same extension to both stores?**
A: Yes! Submit to both Chrome Web Store and Microsoft Edge Add-ons store. It's recommended to support both browsers.
