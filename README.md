# 📁 Telegram File Sharing Bot for Bots.Business (.bb)

> **24/7 Cloud Hosted on Bots.Business • No VPS / Server Needed • Force Subscribe • Admin Panel • Broadcast**

Yeh bot **Bots.Business (`.bb`)** platform ke liye banaya gaya hai. Isko run aur host karne ke liye aapko kisi bhi VPS ya external server ki zaroorat nahi hai. Yeh direct **Bots.Business Cloud** par 24/7 bilkul free me host hota hai.

---

## 🌟 Features (Bot ki Khasiyat)

- ⚡ **Direct File Sharing Links:** Kisi bhi Document, Video, Audio, Photo, ya APK ko bhejo aur instant permanent link pao (`https://t.me/YourBot?start=FS_XXXXX`).
- 🔒 **Force Subscribe (FSUB):** Users tabhi file download kar payenge jab wo aapka Telegram Channel join karenge!
- 👑 **Full Admin Panel (`/admin`):**
  - Live statistics (Total users & files)
  - Force Subscribe channel set/remove karna (`/setchannel`, `/delchannel`)
  - Broadcast message har user tak pahunchana (`/broadcast`)
  - Files list dekhna aur delete karna (`/files`, `/deletefile`)
  - Public upload enable/disable karna (`/publicupload on/off`)
- 🤖 **Auto Configuration:** Bot start hone par apna username aur first admin khud detect aur configure kar leta hai.
- 📱 **Mobile & Web Friendly:** Bots.Business mobile app ya web dashboard dono se easily manage hota hai.

---

## 🚀 Setup & Hosting Guide (Step-by-Step)

### Step 1: Telegram Par Bot Create Karein
1. Telegram par **[@BotFather](https://t.me/BotFather)** open karein.
2. `/newbot` command bhejein.
3. Bot ka **Name** aur **Username** choose karein (username ke end me `bot` hona chahiye, jaise `MyFileShare_bot`).
4. `@BotFather` aapko ek **API Token** dega (jaise `123456789:ABCdefGhIJKlmNoPQRstuVWXyz`). Isko copy kar lein.

---

### Step 2: Bots.Business Par Bot Host Karein
1. **[Bots.Business](https://bots.business)** website open karein ya unka Android/iOS app download karein.
2. Apna account login karein.
3. **"Create Bot"** ya **"+"** button par click karein.
4. `@BotFather` se mila hua **API Token** enter karein.
5. Aapka bot Bots.Business cloud par live ho jayega!

---

### Step 3: Code / Commands Import Kaise Karein

Aap do aasan tareeqon se commands daal sakte hain:

#### Tareeqa A (GitHub / Git Sync - Sabse Fast):
1. Is folder ko apne GitHub repository me push karein.
2. Bots.Business dashboard me apne Bot ki **Settings ⚙️ -> Git** par jayein.
3. Apna GitHub repo URL daalein aur **Sync / Import** par click karein.
4. Sabhi 18 commands automatically aapke bot me aa jayenge!

#### Tareeqa B (Bots.Business App / Web me Direct Copy-Paste):
1. Bots.Business me apne bot ke **Commands** section me jayein.
2. **`+ (New Command)`** par click karein.
3. `commands/` folder me di gayi files ke hisab se command banayein:
   - **Command Name:** Jo file ke top par `command:` me likha hai (jaise `/start`, `*`, `/admin`, etc.)
   - **BJS Code:** File ke comment block ke niche ka poora JavaScript code paste karein.
   - **Save** karein.

---

### Step 4: Bot Ko First Time Setup & Admin Claim Karein
1. Apne Telegram bot me jayein aur `/start` dabayein.
2. Bot aapko automatically **Admin** bana dega aur confirmation dega!
3. `/admin` command bhej kar apna Admin Panel verify karein.

---

### Step 5: Force Subscribe (FSUB) Channel Set Karein (Optional)
Agar aap chahte hain ki log file lene se pehle aapka channel join karein:
1. Apna Telegram Channel open karein.
2. Apne Bot ko us channel me **Administrator** banayein (kam se kam "Invite Users via Link" permission den).
3. Bot me ja kar yeh command bhejein:
   ```text
   /setchannel @YourChannelUsername
   ```
   *(Jaise: `/setchannel @MyCoolChannel`)*
4. Ab koi bhi user bina channel join kiye file nahi le payega!
5. Channel hatane ke liye: `/delchannel`

---

## 📜 Complete Command List

### 👤 Regular Users Ke Liye:
| Command | Kaam |
| :--- | :--- |
| `/start` | Bot start karna aur main menu dekhna |
| `/start <file_code>` | Kisi bhi share link se file receive karna |
| `/help` | Bot use karne ki poori guide |
| `/stats` | Bot ke user count aur file count dekhna |
| `/about` | Bot details aur platform info |
| `/upload_info` | File upload karne ka tareeqa |

### 👑 Administrator Ke Liye:
| Command | Kaam |
| :--- | :--- |
| `/admin` | Complete Admin Panel open karna |
| `/setchannel @channel` | Force Subscribe channel lagana |
| `/delchannel` | Force Subscribe channel hatana |
| `/broadcast <message>` | Sabhi users ko ek sath announcement bhejna |
| `/files` | Recent 10 uploaded files aur unke codes dekhna |
| `/deletefile <code_id>` | Kisi bhi file ka link delete karna |
| `/publicupload on` | Sabhi users ko file upload allow karna |
| `/publicupload off` | Sirf Admin upload allow karna (Default) |
| `/setadmin <user_id>` | Admin ownership kisi aur ko transfer karna |

---

## 📁 Project Directory Structure

```text
FILE SHAREBB/
├── bot.json                 # Bots.Business project manifest
├── bb_import.json           # All commands index in JSON format
├── README.md                # Yeh complete guide
└── commands/
    ├── _start.js            # /start and deep-link file dispatcher
    ├── _catchAll.js         # * catch-all for Media (Document/Video/Audio/Photo)
    ├── _getFile.js          # /getFile helper
    ├── _checkJoin.js        # /checkJoin membership verification callback
    ├── _verifyJoin.js       # /verifyJoin retry button handler
    ├── _admin.js            # /admin dashboard
    ├── _setadmin.js         # /setadmin claim & transfer
    ├── _setchannel.js       # /setchannel FSUB configuration
    ├── _delchannel.js       # /delchannel FSUB removal
    ├── _broadcast.js        # /broadcast announcement to all users
    ├── _stats.js            # /stats analytics
    ├── _files.js            # /files list recent files
    ├── _deletefile.js       # /deletefile remove file by code
    ├── _publicupload.js     # /publicupload toggle user upload access
    ├── _help.js             # /help commands manual
    ├── _about.js            # /about bot details
    ├── _upload_info.js      # /upload_info instructions
    └── _onGetMe.js          # /onGetMe automatic bot username sync
```

---

## 💡 Pro Tips & Best Practices
- **Telegram File Permanence:** Telegram par `file_id` permanent hoti hai jab tak original file delete na ho. Isliye Bots.Business properties me sirf metadata aur `file_id` store hota hai, jo super fast aur 100% free hai!
- **Channel Membership:** Agar bot channel me Admin nahi hoga, toh Telegram API user membership check karne ki permission nahi dega. Isliye hamesha bot ko channel me Admin zaroor banayein.
- **Large Files:** Telegram Bot API 20MB (aur bot ke zariye 50MB-2GB tak document forwards) support karta hai.
