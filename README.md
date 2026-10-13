# 📁 Advanced Multi-User Telegram File Sharing Bot (.bb) v3.0

> **Cloud Hosted on Bots.Business • Persistent Reply Keyboards • User Self-Management & Personal Traffic • 3-Type Force Channels • Private Storage Channel • Native Button Styles**

---

## 👑 Configuration Details
- **Admin ID:** `8710308658` (Preset)
- **Deep Link Format:** `https://t.me/<BotUsername>?start=<File_ID>` *(e.g. `start=BQADAQADzB8AAjAeUEZYFkQvPofTKBYE`)*
- **Button Type:** Telegram Native Persistent **Reply Keyboard** (Bottom of chat) + Colored **Inline Buttons** (`primary`, `success`, `danger`).

---

## 🌟 Key Capabilities (मुख्य फीचर्स)

### 1. ⌨️ Persistent Reply Keyboard (स्क्रीन के नीचे परमानेंट बटन्स)
- **Regular Users के लिए:**
  ```text
  [ 📁 My Files ]   [ 📤 Upload File ]
  [ 📊 My Traffic ] [ ℹ️ Help ]
  ```
- **Admin (8710308658) के लिए:**
  ```text
  [ 📁 My Files ]   [ 📤 Upload File ]
  [ 📊 My Traffic ] [ ℹ️ Help ]
  [ 👑 Admin Panel ]
  ```
- **Admin Panel Menu:**
  ```text
  [ 📁 All Files ]     [ 📈 All Traffic ]
  [ 📢 Force Channels ] [ 🔐 Button Locker ]
  [ 🛡️ Protect Content ][ 📢 Broadcast ]
  [ 🔙 Main Menu ]
  ```

### 2. 👥 User Self-Management (हर यूज़र अपनी फ़ाइलें खुद मैनेज करे)
- कोई भी यूज़र बॉट में कोई भी फ़ाइल (Document, Video, Audio, Photo) भेजकर तुरंत लिंक पा सकता है।
- **📁 My Files (`/myfiles`):** यूज़र अपनी सभी अपलोड की गई फ़ाइलें देख सकता है।
- **✏️ Rename & 📝 Caption:** यूज़र अपनी फ़ाइल का नाम और कैप्शन कभी भी बदल सकता है।
- **📊 My Traffic (`/usertraffic`):** हर यूज़र यह देख सकता है कि **उसकी फ़ाइल किस-किसने डाउनलोड की**, उसका नाम, Chat ID, यूज़रनेम और सही समय!
- **🗑️ Delete:** यूज़र अपनी फ़ाइल कभी भी डिलीट कर सकता है।

### 3. 📦 Private Database Storage Channel (`/setdbchannel`)
- एडमिन अपना एक प्राइवेट टेलीग्राम चैनल बना कर बॉट में सेट कर सकता है (`/setdbchannel -100xxxxxxxxxx`).
- कोई भी यूज़र जब कोई फ़ाइल अपलोड करेगा, तो बॉट उस फ़ाइल की एक बैकअप कॉपी तुरंत आपके प्राइवेट डेटाबेस चैनल में स्टोर कर देगा और यूज़र को उसका यूनिक डाउनलोड लिंक दे देगा!

### 4. 📢 3-Type Force Subscribe Channels (`/fsubchannels`)
- 🌐 **Public Channel** (`@username`)
- 🔒 **Private Channel** (`-100...` + invite link)
- 📝 **Request Channel** (जॉइन रिक्वेस्ट भेजते ही फ़ाइल अनलॉक)

### 5. 🛡️ Content Protection (`/protectcontent`)
- Telegram Bot API का `protect_content: true` — यूज़र्स फ़ाइल को Forward या Phone Gallery में Save नहीं कर सकते।

---

## 🚀 Setup & GitHub Push Commands

```powershell
git remote add origin https://github.com/AAPKA_USERNAME/AAPKA_REPO_NAME.git
git push -u origin main
```

Bots.Business में **Settings ⚙️ ➔ Git** में जाकर **Sync / Import** कर लें!
