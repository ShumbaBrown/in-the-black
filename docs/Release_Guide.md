# Release Guide

Complete guide for submitting In The Black to the Apple App Store and Google Play Store.

---

## Pre-Launch (Both Platforms)

### Testing Checklist
- [ ] All features working on TestFlight (iOS) / internal test track (Android)
- [ ] Tested by at least 2 people
- [ ] No critical bugs
- [ ] Books: create, edit, delete working
- [ ] Transactions: add, edit, delete with correct totals
- [ ] Dashboard: net position and summary cards accurate
- [ ] Categories: templates and custom categories working
- [ ] Stats: breakdown chart rendering correctly

### App Assets

**App Icon:**
- Size: 1024 x 1024 pixels (PNG, no transparency)
- No rounded corners (both platforms add them automatically)
- Keep simple, recognizable, 2-3 colors max, avoid text

**Screenshots:**

| Platform | Size | Required |
|----------|------|----------|
| iPhone 6.7" (14/15 Pro Max) | 1290 x 2796 | 3-10 |
| iPhone 5.5" (8 Plus) | 1242 x 2208 | 3-10 |
| Android Phone | 1080 x 1920 (min) | 2-8 |
| Android 7" Tablet | 1200 x 1920 (min) | Optional |
| Android 10" Tablet | 1600 x 2560 (min) | Optional |

**What to Screenshot:**
1. Bookshelf with multiple hobby books
2. Dashboard with net position and transactions
3. Add transaction flow
4. Stats/breakdown chart
5. Category management
6. Book detail tabs

**How to take screenshots:**
```bash
# iOS Simulator
npm run ios    # Cmd+S in simulator to save
# Android Emulator
npm run android
```

**Tips:**
- Use realistic demo data (not "Test Book 123")
- Show the app in action, not empty states
- Add captions/text overlays to explain features
- Tools: screenshots.pro, mockuphone.com

### Store Listing Copy

**App Name:** In The Black

**Subtitle / Short Description (30 chars):**
```
Track your hobby finances
```

**Keywords (iOS, 100 chars max):**
```
hobby,finance,ledger,budget,tracker,expense,income,side project,money,spending,financial
```

**Google Play Tags:** Finance or Lifestyle category

### Privacy Policy (Required by Both Stores)

Host a privacy policy at a public URL. Must include:
- What data you collect (local SQLite only — no server-side data collection)
- How you store it (on-device only, not transmitted)
- What you don't do (sell data, share with third parties)
- User rights (all data is on their device, deletable by uninstalling)
- Contact information

**Hosting options:**
- GitHub Pages (free): Create repo with `index.html`, enable Pages
- Termly (free tier): termly.io — hosted for you

---

## iOS — Apple App Store

### Developer Account
- Enroll at developer.apple.com/programs
- Cost: **$99/year**
- Processing time: 24-48 hours

### Build & Submit

```bash
# Create production build
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios
```

Alternative: Download `.ipa` from Expo dashboard, upload via Transporter app on Mac.

Wait 10-30 minutes for processing after upload.

### App Store Connect Setup

1. **Create App** at appstoreconnect.apple.com
   - Platform: iOS
   - Bundle ID: `com.shumbabrown.intheblack`
   - SKU: `intheblack001`

2. **Pricing:** Free (recommended to start)

3. **Category:**
   - Primary: Finance
   - Secondary: Lifestyle (optional)

4. **Age Rating:** Complete questionnaire (likely 4+)

5. **Upload:**
   - Screenshots (6.7" and 5.5" displays)
   - App description, subtitle, keywords
   - Privacy policy URL
   - App icon (1024x1024)

6. **Review Information:**
   - Contact info (name, phone, email)
   - Reviewer notes (explain features)

7. **Release:** Choose Manual (recommended for first release) or Automatic

### Common iOS Rejections

| Rejection | Fix |
|-----------|-----|
| App crashes on launch | Test thoroughly on TestFlight first |
| Missing privacy policy | Add valid, loading privacy policy URL |
| Placeholder content | All buttons must work; no "Coming Soon" stubs |
| Misleading description | Description must match actual features |
| Unnecessary permissions | Only request what you need; explain in Info.plist |

**If rejected:** Read the reason, fix the specific issue, resubmit with explanation. Resubmission reviews are usually faster (24-48 hours).

---

## Android — Google Play Store

### Developer Account
- Register at play.google.com/console
- Cost: **$25 one-time fee**
- Processing time: 24-48 hours

### Build & Submit

```bash
# Create production build (.aab for Play Store)
eas build --platform android --profile production

# Submit to Google Play Console
eas submit --platform android
```

For sideloading / testing, use the preview profile which outputs an `.apk`:
```bash
eas build --platform android --profile preview
```

### Google Play Console Setup

1. **Create App** at play.google.com/console
2. **Store Listing:** Short/full descriptions, icons, feature graphic (1024x500), screenshots
3. **Content Rating:** Complete IARC questionnaire (likely "Everyone")
4. **App Signing:** Google Play App Signing enabled by default with EAS
5. **Data Safety Section:** Declare no data collection (all local SQLite)
6. **Target Audience:** NOT children under 13

### Testing Tracks

| Track | Purpose | Who can access |
|-------|---------|----------------|
| Internal testing | Dev team (up to 100 testers) | Invite by email |
| Closed testing | Beta testers | Invite by email or link |
| Open testing | Public beta | Anyone can opt in |
| Production | Full release | Everyone |

**Recommended flow:**
1. Upload to **Internal testing** first
2. Test with 2+ people
3. Promote to **Production** when ready

### Common Android Rejections

| Rejection | Fix |
|-----------|-----|
| Missing data safety form | Complete the data safety section in Play Console |
| Target API level too low | EAS handles this — ensure you're on latest Expo SDK |
| Missing feature graphic | Upload a 1024x500 feature graphic |
| Broken functionality | Test on multiple Android versions / screen sizes |

---

## Post-Launch (Both Platforms)

### Monitor Performance (First Week)
- [ ] Check crash reports daily
- [ ] Read user reviews on both stores
- [ ] Monitor download numbers
- [ ] Watch for support emails
- [ ] Test all features still work in production

### Update Process

**1. Increment version in `app.json`:**
```json
{
  "expo": {
    "version": "1.0.1",
    "ios": { "buildNumber": "2" },
    "android": { "versionCode": 2 }
  }
}
```

**2. Build & submit both platforms:**
```bash
eas build --platform all --profile production
eas submit --platform ios
eas submit --platform android
```

**3. Write "What's New" / release notes for both stores.**

### OTA Updates (via EAS Update)

For JavaScript-only changes (no native code), push instant updates without store review:

```bash
eas update --branch production --message "Fixed calculation display bug"
```

**Can OTA update:** JS code, UI changes, bug fixes in JS logic, text/styling
**Cannot OTA update:** Native code, new permissions, version number changes, build config

---

## Quick Reference

### Build Commands

| Profile | iOS | Android |
|---------|-----|---------|
| Development | `eas build -p ios --profile development` | `eas build -p android --profile development` |
| Preview (testing) | `eas build -p ios --profile preview` | `eas build -p android --profile preview` |
| Production | `eas build -p ios --profile production` | `eas build -p android --profile production` |

### Submit Commands

| Platform | Command |
|----------|---------|
| iOS | `eas submit -p ios` |
| Android | `eas submit -p android` |
| Android (specific track) | `eas submit -p android --track internal` |

### Build Both Platforms

```bash
eas build --platform all --profile production
```

---

## Resources & Links

**Apple:**
- App Store Connect: appstoreconnect.apple.com
- Developer Portal: developer.apple.com
- Review Guidelines: developer.apple.com/app-store/review/guidelines

**Google:**
- Play Console: play.google.com/console
- Developer Policy Center: play.google.com/about/developer-content-policy

**Tools:**
- Expo Application Services: expo.dev/eas
- App Icon Generator: appicon.co
- Screenshot Framer: screenshots.pro
- Privacy Policy Generator: app-privacy-policy-generator.nisrulz.com
