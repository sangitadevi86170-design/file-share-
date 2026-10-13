# 📁 Advanced Telegram File Sharing Bot for Bots.Business (.bb) v2.0

> **24/7 Cloud Hosted on Bots.Business • 3-Type Force Channels • File Manager & Rename • Traffic Logs • Button Locker • Content Protection**

Yeh bot **Bots.Business (`.bb`)** platform ke liye banaya gaya ek powerful aur feature-packed **File Sharing Telegram Bot** hai. Isko run aur host karne ke liye aapko kisi bhi VPS ya server ki zaroorat nahi hai. Yeh direct **Bots.Business Cloud** par 24/7 bilkul free me host hota hai.

---

## 🌟 Supercharged Features (सभी नए फीचर्स)

### 1. 📁 File Manager & Editing (`/managefile`, `/files`)
- **Rename Files:** Upload hone ke baad kisi bhi file ka naam badal sakte hain (`/renamefile`).
- **Edit Captions:** File ke sath aane wala custom caption edit ya clear karein (`/setcaption`).
- **File Management Card:** Har file ka code, size, media type, download count, uploaded date aur direct share link dekhein.
- **Delete Files:** Kisi bhi file ko 1 click me storage se remove karein (`/deletefile`).

### 2. 📢 3-Type Force Subscribe Channels (`/fsubchannels`)
Admin 3 alag-alag tarah ke channels add kar sakta hai:
1. 🌐 **Public Channel:** Username se direct link (`@channel_username`).
2. 🔒 **Private Channel:** Invite link (`https://t.me/+join_hash`) aur `-100...` ID.
3. 📝 **Request Channel (Join Approval):** Jahan "Request to Join" enabled hota hai! User jab join request bhej deta hai, bot automatically use verify karke file unlock kar deta hai (`/sentRequest`).

### 3. 📈 Download & Live Traffic Tracker (`/traffic`)
- **Real-Time Logs:** Kis user ne kaunsi file kab download ki, uska poora record!
  - 👤 User Name & @Username
  - 🆔 Telegram ID
  - 📁 File Name & Code
  - ⏰ Exact Date & Timestamp
- Ek click me logs refresh ya clear karne ka option.

### 4. 🔐 Button Locker System (`/buttonlock`)
Admin kisi bhi button ko temporary **LOCK** ya **UNLOCK** kar sakta hai:
- 📤 **Upload Lock:** Regular users ko file upload karne se rokna.
- 📥 **Download Lock:** File downloads ko temporary pause karna.
- 📊 **Stats Lock:** `/stats` button ko lock karna.
- ℹ️ **Help Lock:** `/help` menu lock karna.
- 🤖 **About Lock:** `/about` info lock karna.

### 5. 🛡️ Content Protection (`/protectcontent`)
- Telegram Bot API ka `protect_content` feature!
- Agar yeh ENABLE hai, toh users bot se mili file ko **Forward** ya **Save to Gallery/Downloads** nahi kar sakte! (Anti-leak protection).

### 6. 🚫 Ban & Unban System (`/ban`, `/unban`)
- Kisi bhi spammer ya abusive user ki Telegram ID ban karein taaki wo bot use na kar sake.

---

## 🚀 Setup & GitHub Push Guide

### Step 1: GitHub Par Push Karein
Apne terminal / PowerShell me yeh run karein:
```powershell
git remote add origin https://github.com/AAPKA_USERNAME/AAPKA_REPO_NAME.git
git push -u origin main
```

### Step 2: Bots.Business me Import Karein
1. [bots.business](https://bots.business) me apna bot open karein.
2. **Settings (⚙️) ➔ Git** me jayein.
3. Wahan di gayi **Deploy Key** ko copy karke GitHub Repo ➔ **Settings ➔ Deploy keys ➔ Add deploy key** me paste karein (Allow write access tick karein).
4. Bots.Business me apna Git link aur branch `main` daal kar **Import/Sync** dabayein.
5. Sabhi **33 commands** automatic import ho jayenge!

---

## 📜 Complete Command Sheet

| Command | Category | Kaam |
| :--- | :--- | :--- |
| `/start` | User | Welcome screen & deep-link file dispatcher |
| `/help` | User / Admin | Complete guide manual |
| `/stats` | User / Admin | System stats (Users, Files, Channels) |
| `/about` | User | Bot information |
| `/upload_info` | User | Upload guide |
| `/admin` | Admin | Complete visual control dashboard |
| `/files` | Admin | Recent files with Manage & Delete buttons |
| `/managefile <code>` | Admin | File edit dashboard (Rename, Caption, Delete) |
| `/renamefile <code>` | Admin | File ka naam badalna |
| `/setcaption <code>` | Admin | File ka caption set/change karna |
| `/deletefile <code>` | Admin | File delete karna |
| `/fsubchannels` | Admin | 3-Type Force Subscribe channels manager |
| `/addchannel` | Admin | Public / Private / Request channel add karna |
| `/delchannel` | Admin | Force channel hatana |
| `/traffic` | Admin | Kisne kab kaunsi file download ki (Logs) |
| `/buttonlock` | Admin | Specific buttons lock/unlock karna |
| `/protectcontent` | Admin | Forwarding/Saving rokna (Anti-leech) |
| `/broadcast <msg>` | Admin | Sabhi users ko announcement bhejna |
| `/publicupload` | Admin | User upload toggle karna |
| `/ban <id>` | Admin | User ko ban karna |
| `/unban <id>` | Admin | User ko unban karna |
| `/setadmin <id>` | Admin | Admin ownership transfer karna |

---

## 💡 Bot Creator Pro-Tips
- **Request Channels:** Telegram channels me jab aap "Approve New Members" on karte hain, tab `Request Channel` option select karein. User ke join request bhejte hi bot use allow kar dega!
- **Channel Admin:** Force subscribe channels me Bot ko **Administrator** zaroor banayein taaki Telegram Bot API members check karne ki permission de.
