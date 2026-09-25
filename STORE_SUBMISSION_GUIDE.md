# Extension Store Submission Guide

This directory now contains complete documentation for submitting your extension to both Chrome Web Store and Microsoft Edge Add-ons Store.

## 📋 Quick Overview

Your extension is **100% compatible** with both Chrome and Microsoft Edge. No code changes needed!

### Chrome Web Store
- **Review Time**: 1-3 hours (typically)
- **Fee**: $5 one-time registration
- **Listing**: See `CHROME_STORE_SUBMISSION.md`

### Microsoft Edge Add-ons Store
- **Review Time**: 24-48 hours
- **Fee**: Free (no registration fee)
- **Listing**: See `EDGE_STORE_SUBMISSION.md`

---

## 🚀 Submission Steps (Both Platforms)

### 1. Prepare Your Files

```bash
# Create a clean ZIP with only necessary files
zip -r time-offset-extension.zip \
  manifest.json \
  popup.html \
  popup.js \
  inject.js \
  pageScript.js
```

### 2. Prepare Store Assets

You'll need:
- **Description**: Use the text provided in the store submission docs
- **Icon**: 128×128 pixels (PNG/JPEG)
- **Screenshots**: 
  - Chrome: 1280×800 pixels
  - Edge: 320×480 to 1920×1440 pixels (recommend 1280×800)
- **Privacy Policy**: Provided in both store submission files

### 3. Create Developer Accounts

**Chrome Web Store:**
1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with Google account
3. Pay $5 registration fee

**Microsoft Edge:**
1. Go to [Partner Center](https://partner.microsoft.com)
2. Sign in with Microsoft account
3. No registration fee!

### 4. Submit to Chrome Web Store

1. Open Chrome Developer Dashboard
2. Click "New item"
3. Upload the ZIP file
4. Fill in store listing (see `CHROME_STORE_SUBMISSION.md`)
5. Submit for review

**Approval**: 1-3 hours

### 5. Submit to Microsoft Edge

1. Open Partner Center (Extensions section)
2. Click "Create new extension"
3. Upload the ZIP file
4. Fill in store listing (see `EDGE_STORE_SUBMISSION.md`)
5. Accept policies and submit for review

**Approval**: 24-48 hours

---

## 📝 What to Use From This Guide

### For Chrome Web Store
- Open `CHROME_STORE_SUBMISSION.md`
- Copy the "Store Listing Details" section
- Paste descriptions and keywords into the Chrome Developer Dashboard
- Upload screenshots and icon
- Submit

### For Microsoft Edge
- Open `EDGE_STORE_SUBMISSION.md`
- Copy the "Store Listing Details" section
- Fill in Partner Center forms
- Upload screenshots and icon
- Submit

### For GitHub/Documentation
- Use `README.md` for the general extension documentation
- Link to this repo in your store listings under "Support Website"

---

## ✅ Manifest Compatibility

Your `manifest.json` is already perfect for both platforms:

```json
{
  "manifest_version": 3,
  "name": "Baidu Time Offset Changer",
  "permissions": ["storage", "tabs"],
  "host_permissions": ["*://www.baidu.com/*"],
  "action": { "default_popup": "popup.html" },
  "content_scripts": [{ "js": ["inject.js"], "run_at": "document_start" }]
}
```

✅ Chrome MV3 compatible  
✅ Edge MV3 compatible  
✅ No background service workers (lightweight)  
✅ All APIs used are standard (`chrome.*` namespace)  

---

## 🔐 Privacy & Policies

Both submissions include:
- **Privacy Policy**: Clear statement that no personal data is collected
- **Permissions Justified**: Explains why `storage` and `tabs` are needed
- **No Tracking**: No analytics, no ads, no external servers
- **Data Stored Locally**: Preferences stored only in browser's storage

Copy the privacy policy text from the respective submission file.

---

## 📊 After Approval

### Chrome Web Store
- Extension appears at: https://chrome.google.com/webstore/detail/baidu-time-offset-changer/[EXTENSION_ID]
- Users can install from all Chromium browsers

### Microsoft Edge
- Extension appears at: https://microsoftedge.microsoft.com/addons/detail/[EXTENSION_ID]
- Settings sync via Microsoft account across Windows, Mac, Android, iOS
- Available in Edge browser's extensions menu

### Both Platforms
- Monitor user reviews and ratings
- Respond to user feedback
- Fix bugs and add features
- Update by incrementing version in `manifest.json` and resubmitting

---

## 🎯 Timeline

**Week 1:**
- Day 1: Submit to Chrome Web Store
- Day 1-3: Chrome approval (usually 1-3 hours)
- Day 1: Submit to Microsoft Edge
- Day 1-3: Edge approval (24-48 hours)
- Day 3: Both extensions live and available to users!

---

## 📚 Additional Resources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Microsoft Edge Extensions Documentation](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Partner Center Help](https://support.microsoft.com/en-us/topic/c1d765dd-be5f-47ab-9a96-3fb8b537f183)

---

## ❓ Common Questions

**Q: Do I need different versions?**
A: No! One code base works on both Chrome and Edge.

**Q: Can I submit simultaneously?**
A: Yes, submit to both stores at the same time.

**Q: Do users on Edge need to do anything special?**
A: No, they install it just like any other Edge extension.

**Q: How do I update after release?**
A: Update the `version` field in `manifest.json`, repackage, and resubmit to both stores.

**Q: What if my extension is rejected?**
A: Review the rejection reason, fix the issue, and resubmit. Most rejections are policy-related (wrong descriptions, etc.).

---

## 🎉 You're Ready!

Your extension is production-ready and store-submission-ready. 

**Next Steps:**
1. Review and customize the descriptions in `CHROME_STORE_SUBMISSION.md` and `EDGE_STORE_SUBMISSION.md`
2. Create or prepare your extension icon (128×128 pixels)
3. Take screenshots (2-5 images showing the extension in action)
4. Create accounts on both platforms
5. Submit to both stores!

Good luck! 🚀
