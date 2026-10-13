# 📁 Advanced Multi-User Telegram File Sharing Bot (.bb) v4.0

> **Cloud Hosted on Bots.Business • Persistent Reply Keyboards • User Self-Management & Personal Traffic • 3-Type Force Channels • Storage Channel: -1003772789858**

---

## 👑 Configuration Details
- **Admin ID:** `8710308658` (Preset)
- **Storage / Database Channel ID:** `-1003772789858` (Preset Default)
- **Force Channel Button Label:** **`Join`**
- **Deep Link Format:** `https://t.me/<BotUsername>?start=<File_ID>` *(e.g. `start=BQADAQADzB8AAjAeUEZYFkQvPofTKBYE`)*
- **Button Type:** Telegram Native Persistent **Reply Keyboard** (Bottom of chat) + Colored **Inline Buttons** (`primary`, `success`, `danger`).

---

## 📢 3-Type Force Subscribe Channels

1. 🌐 **Public Channel:**
   - Asks for Username (e.g. `@MyChannel`).
   - Clickable button: **`Join`**.

2. 🔒 **Private Channel:**
   - **Step 1:** Asks for Chat ID (e.g. `-1001234567890`).
   - **Step 2:** Asks for Invite Link (e.g. `https://t.me/+AbCdEfGhIj`).
   - Clickable button: **`Join`**.

3. 📝 **Private Request Channel (Approval Mode):**
   - **Step 1:** Asks for Chat ID (e.g. `-1001234567890`).
   - **Step 2:** Asks for Join Request Link (e.g. `https://t.me/+join_req_hash`).
   - Clickable button: **`Join`**.
   - **Auto-Approval:** यूज़र की जॉइन रिक्वेस्ट अगर पेंडिंग भी है, तब भी बॉट उसे अप्रूव मानकर तुरंत फ़ाइल अनलॉक कर देगा!

---

## 📦 Private Storage Channel: `-1003772789858`
- बॉट में जो भी फ़ाइल अपलोड होगी, उसकी बैकअप कॉपी आपके प्राइवेट चैनल `-1003772789858` में सुरक्षित स्टोर हो जाएगी।
- एडमिन कभी भी `/setdbchannel <new_id>` भेजकर इसे बदल सकता है।

---

## ⌨️ Persistent Reply Keyboard
- **Users:** `[ 📁 My Files ]` `[ 📤 Upload File ]` `[ 📊 My Traffic ]` `[ ℹ️ Help ]`
- **Admin (8710308658):** Includes `[ 👑 Admin Panel ]`

---

## 🚀 Setup & GitHub Push Commands

```powershell
git remote add origin https://github.com/AAPKA_USERNAME/AAPKA_REPO_NAME.git
git push -u origin main
```

Bots.Business में **Settings ⚙️ ➔ Git** में जाकर **Sync / Import** कर लें!
