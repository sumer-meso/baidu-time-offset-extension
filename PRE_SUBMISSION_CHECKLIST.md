# Pre-Submission Checklist

Complete these steps before submitting to either store.

## 🎨 Visual Assets

- [ ] **Icon prepared** (128×128 pixels minimum)
  - Format: PNG or JPEG
  - Clear and recognizable (clock/time theme recommended)
  - No blurry or low-quality images

- [ ] **Screenshots prepared** (at least 2, preferably 3-5)
  - Chrome Web Store: 1280×800 pixels
  - Microsoft Edge: 320×480 to 1920×1440 pixels (recommend 1280×800)
  - Format: PNG or JPEG
  - Should show:
    1. Popup with time offset control
    2. Baidu page with offset applied
    3. (Optional) Custom times section
    4. (Optional) Sun chart visualization
    5. (Optional) Settings panel

## 📦 Code Package

- [ ] **manifest.json** - Verified valid JSON
  - [ ] version field present: `"version": "1.1"`
  - [ ] name field present: `"Baidu Time Offset Changer"`
  - [ ] permissions array correct: `["storage", "tabs"]`
  - [ ] host_permissions include Baidu: `"*://www.baidu.com/*"`
  - [ ] content_scripts configured
  - [ ] web_accessible_resources configured
  - [ ] NO background service worker (removed)

- [ ] **popup.html** - Valid HTML
  - [ ] No syntax errors
  - [ ] Properly formatted
  - [ ] All necessary input fields present

- [ ] **popup.js** - Valid JavaScript
  - [ ] All functions defined
  - [ ] No console.error or console.warn
  - [ ] Proper error handling

- [ ] **inject.js** - Valid JavaScript
  - [ ] Properly injects pageScript.js
  - [ ] Validates userAction flag
  - [ ] No errors or warnings

- [ ] **pageScript.js** - Valid JavaScript
  - [ ] Core logic intact
  - [ ] No console.error
  - [ ] All functions working
  - [ ] Properly handles offset calculations

- [ ] **No unnecessary files included**
  - [ ] No `.git` directory
  - [ ] No `node_modules` directory
  - [ ] No hidden files (`.DS_Store`, `.env`, etc.)
  - [ ] No build artifacts or temp files

## ✍️ Content & Copy

- [ ] **Short Description** (132 characters max)
  - [ ] Describes the core functionality
  - [ ] No promotional language
  - [ ] Professional tone

- [ ] **Full Description**
  - [ ] Clear explanation of features
  - [ ] Explains how to use
  - [ ] Professional and accurate
  - [ ] Free of typos and grammar errors

- [ ] **Keywords/Tags** (if applicable)
  - [ ] Relevant to functionality
  - [ ] 3-5 keywords
  - [ ] No misleading tags

- [ ] **Privacy Policy**
  - [ ] Clearly states: No personal data collection
  - [ ] Explains: Data stored locally only
  - [ ] Addresses: Cloud sync behavior
  - [ ] Accurate and honest

- [ ] **Support Contact**
  - [ ] Email address provided
  - [ ] Website/documentation link provided
  - [ ] GitHub repo link (recommended)

## 🔒 Security & Compliance

- [ ] **No malicious code**
  - [ ] No tracking or analytics
  - [ ] No ad injection
  - [ ] No data exfiltration
  - [ ] No cryptocurrency mining
  - [ ] No phishing or scams

- [ ] **No restricted content**
  - [ ] No hate speech
  - [ ] No violence or illegal content
  - [ ] No adult/explicit content
  - [ ] No copyright/IP violations

- [ ] **Permissions justified**
  - [ ] `storage` - for saving preferences ✓
  - [ ] `tabs` - for communicating with page ✓
  - [ ] No unnecessary permissions

- [ ] **Privacy policy accepted**
  - [ ] Clear and accurate
  - [ ] Compliant with store policies
  - [ ] No misleading claims

## 🧪 Testing

- [ ] **Tested on Chrome** (latest version)
  - [ ] Extension loads without errors
  - [ ] Icon appears in toolbar
  - [ ] Popup opens and displays correctly
  - [ ] Time offset functionality works
  - [ ] Custom times work (optional feature)
  - [ ] Settings save and persist
  - [ ] No console errors (F12 → Console)

- [ ] **Tested on Microsoft Edge** (latest version)
  - [ ] Extension loads without errors
  - [ ] Icon appears in toolbar
  - [ ] Popup opens and displays correctly
  - [ ] Time offset functionality works
  - [ ] Custom times work (optional feature)
  - [ ] Settings save and persist
  - [ ] No console errors

- [ ] **Tested on target website** (Baidu.com)
  - [ ] Works on www.baidu.com search pages
  - [ ] Time display updates correctly
  - [ ] No page load delays
  - [ ] No broken functionality

- [ ] **Behavior verification**
  - [ ] Changes only apply on user action
  - [ ] No auto-application on page reload ✓
  - [ ] Sun chart draws only on user action ✓
  - [ ] Settings sync across sessions ✓

## 📋 Store-Specific Preparation

### For Chrome Web Store

- [ ] Chrome Web Store account created
- [ ] $5 registration fee paid
- [ ] Developer dashboard accessible
- [ ] ZIP file ready for upload:
  ```bash
  zip -r time-offset-extension.zip \
    manifest.json popup.html popup.js inject.js pageScript.js
  ```

### For Microsoft Edge Add-ons Store

- [ ] Partner Center account created (partner.microsoft.com)
- [ ] Publisher profile completed
- [ ] ZIP file ready for upload (same as Chrome)
- [ ] Confirmed: No registration fee required

## 📝 Documentation

- [ ] **README.md** - Complete project documentation ✓
- [ ] **CHROME_STORE_SUBMISSION.md** - Chrome store details ✓
- [ ] **EDGE_STORE_SUBMISSION.md** - Edge store details ✓
- [ ] **STORE_SUBMISSION_GUIDE.md** - Overall guide ✓
- [ ] **CODE_ANALYSIS.md** - Technical documentation ✓

## 🚀 Final Pre-Submission Steps

**24 hours before submission:**

- [ ] Review all descriptions for typos and accuracy
- [ ] Test extension one more time on both browsers
- [ ] Verify all links in descriptions are correct
- [ ] Double-check privacy policy for accuracy
- [ ] Ensure icon and screenshots look professional
- [ ] Review manifest.json one final time

**1 hour before submission:**

- [ ] Create fresh ZIP file with all required files
- [ ] Verify ZIP file contains only necessary files
- [ ] Test that ZIP can be unpacked and loaded
- [ ] Take a screenshot of your test installation
- [ ] Have all descriptions copied and ready to paste

**At submission time:**

- [ ] Open store submission page in browser
- [ ] Have all assets (icon, screenshots) accessible
- [ ] Have all descriptions copied to clipboard
- [ ] Proceed with submission following store guidelines

## ✅ After First Submission (Either Store)

- [ ] Monitor review status daily
- [ ] Check email for approval/rejection
- [ ] If approved: Celebrate! 🎉
- [ ] If rejected: Read reason carefully and resubmit
- [ ] Once one store approves: Submit to other store

## 📊 Tracking

**Chrome Web Store Submission:**
- Date submitted: _______________
- Date approved/rejected: _______________
- Extension URL: https://chrome.google.com/webstore/detail/[ID]

**Microsoft Edge Add-ons Submission:**
- Date submitted: _______________
- Date approved/rejected: _______________
- Extension URL: https://microsoftedge.microsoft.com/addons/detail/[ID]

---

## Notes

- Keep this checklist handy during the submission process
- Check off items as you complete them
- If anything is unclear, refer to the corresponding store submission guide
- Both stores have similar review standards—most first submissions are approved
- Review time varies but typically Chrome (1-3 hours) and Edge (24-48 hours)

**Good luck with your submission! 🚀**
