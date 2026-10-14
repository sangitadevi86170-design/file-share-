/*CMD
  command: *
  help: Catch-all command to handle media uploads for all users and unrecognized messages
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// 0. Check if user is banned
var bannedUsers = Bot.getProperty("banned_users") || [];
if (bannedUsers.indexOf(user.telegramid) !== -1) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You are banned from using this bot.", { parse_mode: "html" });
  return;
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isUserAdmin = (String(user.telegramid) === "8710308658" || String(user.telegramid) === String(adminId));
var lockedButtons = Bot.getProperty("locked_buttons") || {};

// Comprehensive media detection across all Bots.Business BJS execution contexts
var doc = (typeof request !== "undefined" && request && request.document) || 
          (typeof request !== "undefined" && request && request.message && request.message.document) || 
          (typeof options !== "undefined" && options && options.document) || 
          (typeof message === "object" && message && message.document);

var video = (typeof request !== "undefined" && request && request.video) || 
            (typeof request !== "undefined" && request && request.message && request.message.video) || 
            (typeof options !== "undefined" && options && options.video) || 
            (typeof message === "object" && message && message.video);

var photo = (typeof request !== "undefined" && request && request.photo) || 
            (typeof request !== "undefined" && request && request.message && request.message.photo) || 
            (typeof options !== "undefined" && options && options.photo) || 
            (typeof message === "object" && message && message.photo);

var audio = (typeof request !== "undefined" && request && request.audio) || 
            (typeof request !== "undefined" && request && request.message && request.message.audio) || 
            (typeof options !== "undefined" && options && options.audio) || 
            (typeof message === "object" && message && message.audio);

var voice = (typeof request !== "undefined" && request && request.voice) || 
            (typeof request !== "undefined" && request && request.message && request.message.voice) || 
            (typeof options !== "undefined" && options && options.voice) || 
            (typeof message === "object" && message && message.voice);

var animation = (typeof request !== "undefined" && request && request.animation) || 
                (typeof request !== "undefined" && request && request.message && request.message.animation) || 
                (typeof options !== "undefined" && options && options.animation);

var caption = (typeof request !== "undefined" && request && request.caption) || 
              (typeof request !== "undefined" && request && request.message && request.message.caption) || 
              (typeof message === "string" && message ? message : "");

var hasMedia = (doc || video || photo || audio || voice || animation);

if (hasMedia) {
  // Check button locker for uploads (admin can always upload)
  if (lockedButtons.upload && !isUserAdmin) {
    Bot.sendMessage(
      "🔒 <b>Uploads Locked:</b> File uploads are temporarily locked by the administrator.",
      { parse_mode: "html" }
    );
    return;
  }

  var fileId = "";
  var fileType = "";
  var fileName = "";
  var fileSize = 0;

  if (doc) {
    fileType = "document";
    fileId = doc.file_id;
    fileName = doc.file_name || "Document";
    fileSize = doc.file_size || 0;
  } else if (video) {
    fileType = "video";
    fileId = video.file_id;
    fileName = video.file_name || "Video.mp4";
    fileSize = video.file_size || 0;
  } else if (animation) {
    fileType = "animation";
    fileId = animation.file_id;
    fileName = animation.file_name || "Animation.gif";
    fileSize = animation.file_size || 0;
  } else if (photo) {
    fileType = "photo";
    var photoArr = Array.isArray(photo) ? photo : [photo];
    var bestPhoto = photoArr[photoArr.length - 1];
    fileId = bestPhoto.file_id;
    fileName = "Photo.jpg";
    fileSize = bestPhoto.file_size || 0;
  } else if (audio) {
    fileType = "audio";
    fileId = audio.file_id;
    fileName = (audio.title ? (audio.title + ".mp3") : (audio.file_name || "Audio.mp3"));
    fileSize = audio.file_size || 0;
  } else if (voice) {
    fileType = "voice";
    fileId = voice.file_id;
    fileName = "Voice_Note.ogg";
    fileSize = voice.file_size || 0;
  }

  // Format file size nicely
  var sizeText = "Unknown";
  if (fileSize > 0) {
    if (fileSize >= 1048576) {
      sizeText = (fileSize / 1048576).toFixed(2) + " MB";
    } else {
      sizeText = (fileSize / 1024).toFixed(2) + " KB";
    }
  }

  // Generate unique file code
  // Priority: Use Telegram file_id directly if <= 64 chars and URL-safe (e.g. BQADAQADzB8AAjAeUEZYFkQvPofTKBYE)
  var fileCode = "";
  var isValidTelegramId = (fileId && fileId.length <= 64 && /^[a-zA-Z0-9_-]+$/.test(fileId));
  
  if (isValidTelegramId) {
    fileCode = fileId;
  } else {
    // Clean base64-style unique alphanumeric code
    var r1 = Math.random().toString(36).substring(2, 10);
    var r2 = (new Date().getTime()).toString(36);
    fileCode = (r1 + r2).toUpperCase();
  }

  // Save file record
  var fileData = {
    code: fileCode,
    file_id: fileId,
    type: fileType,
    name: fileName,
    size: sizeText,
    caption: caption,
    uploaded_by: user.telegramid,
    uploader_name: (user.first_name || "") + (user.last_name ? (" " + user.last_name) : ""),
    uploader_username: user.username ? ("@" + user.username) : "None",
    uploaded_at: new Date().toISOString(),
    downloads: 0
  };

  Bot.setProperty("file_" + fileCode, fileData, "json");

  // Save to user's personal files list
  var userFiles = User.getProperty("user_files") || [];
  if (userFiles.indexOf(fileCode) === -1) {
    userFiles.unshift(fileCode);
    User.setProperty("user_files", userFiles, "json");
  }

  // Update global files list & total count
  var filesList = Bot.getProperty("files_list") || [];
  filesList.push(fileCode);
  Bot.setProperty("files_list", filesList, "json");

  var totalFiles = (Bot.getProperty("total_files") || 0) + 1;
  Bot.setProperty("total_files", totalFiles, "integer");

  var botUsername = Bot.getProperty("bot_username") || (bot && bot.name) || "FileShareBot";
  if (!Bot.getProperty("bot_username")) {
    Api.getMe({ on_result: "/onGetMe" });
  }

  var shareUrl = "https://t.me/" + botUsername + "?start=" + fileCode;
  var tgShareLink = "https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent("📁 Get file: " + fileName);

  // 📦 PRIVATE STORAGE CHANNEL BACKUP (Default -1003772789858 or configured)
  var dbChannel = Bot.getProperty("db_channel") || "-1003772789858";
  if (dbChannel) {
    var dbCaption = "📁 <b>File Stored in Database Channel:</b>\n\n" +
      "• <b>Name:</b> <code>" + fileName + "</code>\n" +
      "• <b>Size:</b> " + sizeText + " [" + fileType.toUpperCase() + "]\n" +
      "• <b>Code:</b> <code>" + fileCode + "</code>\n" +
      "• <b>Uploaded By:</b> <code>" + user.telegramid + "</code> (" + (user.first_name || "") + " " + (user.username ? ("@" + user.username) : "") + ")\n" +
      "• <b>Download Link:</b> " + shareUrl;

    try {
      if (fileType === "document") {
        Api.sendDocument({ chat_id: dbChannel, document: fileId, caption: dbCaption, parse_mode: "html" });
      } else if (fileType === "video") {
        Api.sendVideo({ chat_id: dbChannel, video: fileId, caption: dbCaption, parse_mode: "html" });
      } else if (fileType === "photo") {
        Api.sendPhoto({ chat_id: dbChannel, photo: fileId, caption: dbCaption, parse_mode: "html" });
      } else if (fileType === "audio") {
        Api.sendAudio({ chat_id: dbChannel, audio: fileId, caption: dbCaption, parse_mode: "html" });
      } else if (fileType === "voice") {
        Api.sendVoice({ chat_id: dbChannel, voice: fileId, caption: dbCaption, parse_mode: "html" });
      }
    } catch (e) {}
  }

  var successText = "✅ <b>File Uploaded Successfully!</b>\n\n" +
    "📁 <b>Name:</b> <code>" + fileName + "</code>\n" +
    "📦 <b>Size:</b> " + sizeText + "\n" +
    "🏷️ <b>Type:</b> " + fileType.toUpperCase() + "\n" +
    "🔑 <b>File Key:</b> <code>" + fileCode + "</code>\n\n" +
    "🔗 <b>Your Permanent Download Link:</b>\n" +
    "<code>" + shareUrl + "</code>\n\n" +
    "🚀 <b>One-Click Share:</b>\n" +
    tgShareLink;

  var replyKeyboard = (isUserAdmin) ? [
    [
      { text: "📁 My Files", style: "primary" },
      { text: "📤 Upload File", style: "success" },
      { text: "📊 My Traffic", style: "primary" }
    ],
    [
      { text: "🤖 My Bots", style: "primary" },
      { text: "📊 Bot Stats", style: "primary" },
      { text: "ℹ️ Help", style: "primary" }
    ],
    [
      { text: "👑 Admin Panel", style: "primary" },
      { text: "📦 Storage DB", style: "success" },
      { text: "🔙 Main Menu", style: "danger" }
    ]
  ] : [
    [
      { text: "📁 My Files", style: "primary" },
      { text: "📤 Upload File", style: "success" },
      { text: "📊 My Traffic", style: "primary" }
    ],
    [
      { text: "🤖 My Bots", style: "primary" },
      { text: "ℹ️ Help", style: "primary" },
      { text: "🔙 Main Menu", style: "danger" }
    ]
  ];

  Api.sendMessage({
    chat_id: chat.chatid,
    text: successText,
    parse_mode: "html",
    reply_markup: {
      keyboard: replyKeyboard,
      resize_keyboard: true,
      is_persistent: true
    }
  });
  return;
}

// Fallback for general text messages & Button-driven State Machine
var incomingText = "";
if (typeof message === "string") {
  incomingText = message.trim();
} else if (typeof message === "object" && message && message.text) {
  incomingText = message.text.trim();
} else if (typeof request !== "undefined" && request && request.text) {
  incomingText = request.text.trim();
} else if (typeof request !== "undefined" && request && request.message && request.message.text) {
  incomingText = request.message.text.trim();
}

// Check if user clicked a menu or navigation button
var isNavButton = (
  incomingText.indexOf("Main Menu") !== -1 ||
  incomingText.indexOf("Admin Panel") !== -1 ||
  incomingText.indexOf("Back to Channels") !== -1 ||
  incomingText.indexOf("My Files") !== -1 ||
  incomingText.indexOf("Force Channels") !== -1 ||
  incomingText === "/cancel"
);

var adminState = User.getProperty("admin_state");
var userState = User.getProperty("user_state") || "";

// If admin tapped a navigation button, cancel any pending state
if (isNavButton) {
  User.setProperty("admin_state", null, "string");
  User.setProperty("user_state", null, "string");
  if (incomingText.indexOf("Admin Panel") !== -1) {
    Bot.runCommand("/admin");
    return;
  }
  if (incomingText.indexOf("Back to Channels") !== -1 || incomingText.indexOf("Force Channels") !== -1) {
    Bot.runCommand("/fsubchannels");
    return;
  }
  if (incomingText.indexOf("My Files") !== -1) {
    Bot.runCommand("/myfiles");
    return;
  }
  if (incomingText.indexOf("Main Menu") !== -1 || incomingText === "/cancel") {
    Bot.runCommand("/start");
    return;
  }
}

// ─── ADMIN CONVERSATIONAL STATE MACHINE ─────────────────────────
if (isUserAdmin && adminState) {
  // 1. Setting Support Username
  if (adminState === "waiting_support_username") {
    User.setProperty("admin_state", null, "string");
    var cleanSupport = incomingText.replace("@", "").trim();
    Bot.setProperty("support_username", cleanSupport, "string");

    var adminReplyKeyboard = [
      [
        { text: "📁 All Files", style: "primary" },
        { text: "📈 All Traffic", style: "primary" },
        { text: "📢 Force Channels", style: "primary" }
      ],
      [
        { text: "🔐 Button Locker", style: "primary" },
        { text: "🛡️ Protect Content", style: "primary" },
        { text: "📦 Storage DB", style: "success" }
      ],
      [
        { text: "💬 Set Support", style: "primary" },
        { text: "📢 Broadcast", style: "primary" },
        { text: "🔙 Main Menu", style: "danger" }
      ]
    ];

    Api.sendMessage({
      chat_id: chat.chatid,
      text: "✅ <b>Support Contact Updated Successfully!</b>\n\n" +
        "• <b>New Support Username:</b> @" + cleanSupport + "\n\n" +
        "Users tapping <b>ℹ️ Help</b> will now directly see this contact.",
      parse_mode: "html",
      reply_markup: {
        keyboard: adminReplyKeyboard,
        resize_keyboard: true,
        is_persistent: true
      }
    });
    return;
  }

  // 2. Broadcast Message
  if (adminState === "waiting_broadcast_message") {
    User.setProperty("admin_state", null, "string");
    var userList = Bot.getProperty("user_list") || [];
    var sentCount = 0;
    var failedCount = 0;

    for (var u = 0; u < userList.length; u++) {
      try {
        Api.sendMessage({
          chat_id: userList[u],
          text: "📢 <b>Announcement:</b>\n\n" + incomingText,
          parse_mode: "html"
        });
        sentCount++;
      } catch (err) {
        failedCount++;
      }
    }

    var adminReplyKeyboard = [
      [
        { text: "📁 All Files", style: "primary" },
        { text: "📈 All Traffic", style: "primary" },
        { text: "📢 Force Channels", style: "primary" }
      ],
      [
        { text: "🔐 Button Locker", style: "primary" },
        { text: "🛡️ Protect Content", style: "primary" },
        { text: "📦 Storage DB", style: "success" }
      ],
      [
        { text: "💬 Set Support", style: "primary" },
        { text: "📢 Broadcast", style: "primary" },
        { text: "🔙 Main Menu", style: "danger" }
      ]
    ];

    Api.sendMessage({
      chat_id: chat.chatid,
      text: "✅ <b>Broadcast Dispatched Successfully!</b>\n\n" +
        "• <b>Total Users Targeted:</b> " + userList.length + "\n" +
        "• <b>Messages Delivered:</b> " + sentCount + "\n" +
        (failedCount > 0 ? ("• <b>Failed/Blocked:</b> " + failedCount + "\n") : ""),
      parse_mode: "html",
      reply_markup: {
        keyboard: adminReplyKeyboard,
        resize_keyboard: true,
        is_persistent: true
      }
    });
    return;
  }

  // 3. Public Channel Username Input
  if (adminState === "waiting_public_channel") {
    User.setProperty("admin_state", null, "string");
    var chHandle = incomingText.replace("@", "").trim();
    if (chHandle.indexOf("t.me/") !== -1) {
      chHandle = chHandle.split("t.me/")[1].replace("/", "").trim();
    }
    var chId = "@" + chHandle;
    var chLink = "https://t.me/" + chHandle;

    var channels = Bot.getProperty("fsub_channels") || [];
    var chExists = false;
    for (var c = 0; c < channels.length; c++) {
      if (channels[c].id.toLowerCase() === chId.toLowerCase()) {
        channels[c].link = chLink;
        channels[c].type = "public";
        channels[c].title = chId;
        chExists = true;
        break;
      }
    }
    if (!chExists) {
      channels.push({ id: chId, link: chLink, title: chId, type: "public" });
    }
    Bot.setProperty("fsub_channels", channels, "json");
    Bot.setProperty("fsub_channel", chId, "string");

    var fsubKeyboard = [
      [
        { text: "🌐 Public Channel", style: "primary" },
        { text: "🔒 Private Channel", style: "primary" },
        { text: "📝 Request Channel", style: "primary" }
      ],
      [
        { text: "🗑️ Remove All Channels", style: "danger" },
        { text: "👑 Admin Panel", style: "primary" },
        { text: "🔙 Main Menu", style: "danger" }
      ]
    ];

    Api.sendMessage({
      chat_id: chat.chatid,
      text: "✅ <b>Public Channel Added Successfully!</b>\n\n" +
        "• <b>Type:</b> 🌐 PUBLIC\n" +
        "• <b>Username:</b> <code>" + chId + "</code>\n" +
        "• <b>Link:</b> " + chLink + "\n\n" +
        "Users will now be required to join this channel before accessing shared files.",
      parse_mode: "html",
      reply_markup: {
        keyboard: fsubKeyboard,
        resize_keyboard: true,
        is_persistent: true
      }
    });
    Bot.runCommand("/fsubchannels");
    return;
  }

  // 4. Private Channel: Chat ID (Step 1/2)
  if (adminState === "waiting_private_chat_id") {
    User.setProperty("temp_private_id", incomingText, "string");
    User.setProperty("admin_state", "waiting_private_link", "string");

    var navKeyboard = [
      [
        { text: "🔙 Back to Channels", style: "primary" },
        { text: "👑 Admin Panel", style: "primary" },
        { text: "🔙 Main Menu", style: "danger" }
      ]
    ];

    Api.sendMessage({
      chat_id: chat.chatid,
      text: "🔒 <b>PRIVATE CHANNEL SETUP (Step 2 of 2):</b>\n\n" +
        "• Chat ID Saved: <code>" + incomingText + "</code>\n\n" +
        "Now please send the Private Channel's <b>Invite Link</b>:\n" +
        "<i>Example:</i> <code>https://t.me/+AbCdEfGhIj</code>\n\n" +
        "<i>Or tap [ 🔙 Back to Channels ] to cancel.</i>",
      parse_mode: "html",
      reply_markup: {
        keyboard: navKeyboard,
        resize_keyboard: true,
        is_persistent: true
      }
    });
    return;
  }

  // 5. Private Channel: Invite Link (Step 2/2)
  if (adminState === "waiting_private_link") {
    User.setProperty("admin_state", null, "string");
    var privId = User.getProperty("temp_private_id") || "Private Channel";
    User.setProperty("temp_private_id", null, "string");

    var channels = Bot.getProperty("fsub_channels") || [];
    channels.push({
      id: privId,
      link: incomingText,
      title: "Private Channel (" + privId + ")",
      type: "private"
    });
    Bot.setProperty("fsub_channels", channels, "json");
    Bot.setProperty("fsub_channel", privId, "string");

    var fsubKeyboard = [
      [
        { text: "🌐 Public Channel", style: "primary" },
        { text: "🔒 Private Channel", style: "primary" },
        { text: "📝 Request Channel", style: "primary" }
      ],
      [
        { text: "🗑️ Remove All Channels", style: "danger" },
        { text: "👑 Admin Panel", style: "primary" },
        { text: "🔙 Main Menu", style: "danger" }
      ]
    ];

    Api.sendMessage({
      chat_id: chat.chatid,
      text: "✅ <b>Private Channel Added Successfully!</b>\n\n" +
        "• <b>Type:</b> 🔒 PRIVATE\n" +
        "• <b>Chat ID:</b> <code>" + privId + "</code>\n" +
        "• <b>Invite Link:</b> " + incomingText,
      parse_mode: "html",
      reply_markup: {
        keyboard: fsubKeyboard,
        resize_keyboard: true,
        is_persistent: true
      }
    });
    Bot.runCommand("/fsubchannels");
    return;
  }

  // 6. Request Channel: Chat ID (Step 1/2)
  if (adminState === "waiting_request_chat_id") {
    User.setProperty("temp_request_id", incomingText, "string");
    User.setProperty("admin_state", "waiting_request_link", "string");

    var navKeyboard = [
      [
        { text: "🔙 Back to Channels", style: "primary" },
        { text: "👑 Admin Panel", style: "primary" },
        { text: "🔙 Main Menu", style: "danger" }
      ]
    ];

    Api.sendMessage({
      chat_id: chat.chatid,
      text: "📝 <b>PRIVATE REQUEST CHANNEL SETUP (Step 2 of 2):</b>\n\n" +
        "• Chat ID Saved: <code>" + incomingText + "</code>\n\n" +
        "Now please send the <b>Join Request Link</b>:\n" +
        "<i>Example:</i> <code>https://t.me/+RequestJoinHash</code>\n\n" +
        "💡 <i>Users with pending join requests will automatically be approved to download files!</i>\n\n" +
        "<i>Or tap [ 🔙 Back to Channels ] to cancel.</i>",
      parse_mode: "html",
      reply_markup: {
        keyboard: navKeyboard,
        resize_keyboard: true,
        is_persistent: true
      }
    });
    return;
  }

  // 7. Request Channel: Request Link (Step 2/2)
  if (adminState === "waiting_request_link") {
    User.setProperty("admin_state", null, "string");
    var reqId = User.getProperty("temp_request_id") || "Request Channel";
    User.setProperty("temp_request_id", null, "string");

    var channels = Bot.getProperty("fsub_channels") || [];
    channels.push({
      id: reqId,
      link: incomingText,
      title: "Request Channel (" + reqId + ")",
      type: "request"
    });
    Bot.setProperty("fsub_channels", channels, "json");
    Bot.setProperty("fsub_channel", reqId, "string");

    var fsubKeyboard = [
      [
        { text: "🌐 Public Channel", style: "primary" },
        { text: "🔒 Private Channel", style: "primary" },
        { text: "📝 Request Channel", style: "primary" }
      ],
      [
        { text: "🗑️ Remove All Channels", style: "danger" },
        { text: "👑 Admin Panel", style: "primary" },
        { text: "🔙 Main Menu", style: "danger" }
      ]
    ];

    Api.sendMessage({
      chat_id: chat.chatid,
      text: "✅ <b>Private Request Channel Added Successfully!</b>\n\n" +
        "• <b>Type:</b> 📝 PRIVATE REQUEST (Approval Mode)\n" +
        "• <b>Chat ID:</b> <code>" + reqId + "</code>\n" +
        "• <b>Request Link:</b> " + incomingText + "\n\n" +
        "💡 <i>Users with pending join requests will automatically unlock files!</i>",
      parse_mode: "html",
      reply_markup: {
        keyboard: fsubKeyboard,
        resize_keyboard: true,
        is_persistent: true
      }
    });
    Bot.runCommand("/fsubchannels");
    return;
  }

  // 8. Storage DB Channel Update
  if (adminState === "waiting_db_channel") {
    User.setProperty("admin_state", null, "string");
    var dbId = incomingText;
    Bot.setProperty("db_channel", dbId, "string");

    var adminReplyKeyboard = [
      [
        { text: "📁 All Files", style: "primary" },
        { text: "📈 All Traffic", style: "primary" },
        { text: "📢 Force Channels", style: "primary" }
      ],
      [
        { text: "🔐 Button Locker", style: "primary" },
        { text: "🛡️ Protect Content", style: "primary" },
        { text: "📦 Storage DB", style: "success" }
      ],
      [
        { text: "💬 Set Support", style: "primary" },
        { text: "📢 Broadcast", style: "primary" },
        { text: "🔙 Main Menu", style: "danger" }
      ]
    ];

    Api.sendMessage({
      chat_id: chat.chatid,
      text: "✅ <b>Storage / Database Channel Updated Successfully!</b>\n\n" +
        "• <b>Backup Channel ID:</b> <code>" + dbId + "</code>\n\n" +
        "All uploaded files will now automatically be backed up to this channel!",
      parse_mode: "html",
      reply_markup: {
        keyboard: adminReplyKeyboard,
        resize_keyboard: true,
        is_persistent: true
      }
    });
    return;
  }

  // 9. Network Bot Input
  if (adminState === "waiting_bot_input") {
    User.setProperty("admin_state", null, "string");
    var parts = incomingText.split(" ");
    var bUser = parts[0];
    if (bUser.indexOf("@") !== 0 && bUser.indexOf("http") !== 0) {
      bUser = "@" + bUser;
    }
    var bLink = "";
    var cleanHandle = bUser;
    if (bUser.indexOf("http") === 0) {
      bLink = bUser;
      cleanHandle = bUser.split("/").pop();
      if (cleanHandle.indexOf("@") !== 0) cleanHandle = "@" + cleanHandle;
    } else {
      bLink = "https://t.me/" + bUser.replace("@", "");
    }
    var bTitle = parts.length > 1 ? parts.slice(1).join(" ") : cleanHandle;
    var botsList = Bot.getProperty("my_bots_list") || [];
    botsList.push({ username: cleanHandle, title: bTitle, link: bLink });
    Bot.setProperty("my_bots_list", botsList, "json");

    Bot.sendMessage(
      "✅ <b>Bot Added to 'My Bots' Successfully!</b>\n\n" +
      "• <b>Title:</b> " + bTitle + "\n" +
      "• <b>Username:</b> " + cleanHandle + "\n" +
      "• <b>Link:</b> " + bLink,
      { parse_mode: "html" }
    );
    Bot.runCommand("/managebots");
    return;
  }
}

// ─── USER FILE RENAME & CAPTION STATE MACHINE ───────────────────
if (userState) {
  if (userState.indexOf("waiting_rename_") === 0) {
    var rCode = userState.replace("waiting_rename_", "");
    User.setProperty("user_state", null, "string");
    var rData = Bot.getProperty("file_" + rCode);
    if (rData) {
      rData.name = incomingText;
      Bot.setProperty("file_" + rCode, rData, "json");
      Bot.sendMessage(
        "✅ <b>File Renamed Successfully!</b>\n\n" +
        "• <b>New Name:</b> <code>" + incomingText + "</code>",
        { parse_mode: "html" }
      );
      Bot.runCommand("/managefile " + rCode);
      return;
    }
  }

  if (userState.indexOf("waiting_caption_") === 0) {
    var cCode = userState.replace("waiting_caption_", "");
    User.setProperty("user_state", null, "string");
    var cData = Bot.getProperty("file_" + cCode);
    if (cData) {
      cData.caption = (incomingText.toLowerCase() === "clear" || incomingText.toLowerCase() === "none") ? "" : incomingText;
      Bot.setProperty("file_" + cCode, cData, "json");
      Bot.sendMessage(
        "✅ <b>Caption Updated Successfully!</b>",
        { parse_mode: "html" }
      );
      Bot.runCommand("/managefile " + cCode);
      return;
    }
  }
}

// Clickable action command shortcuts
if (incomingText.indexOf("/del_") === 0) {
  var codeToDel = incomingText.replace("/del_", "");
  Bot.runCommand("/deletefile " + codeToDel);
  return;
}

if (incomingText.indexOf("/manage_") === 0) {
  var codeToManage = incomingText.replace("/manage_", "");
  Bot.runCommand("/managefile " + codeToManage);
  return;
}

if (incomingText.indexOf("/traffic_") === 0) {
  var codeToTraffic = incomingText.replace("/traffic_", "");
  Bot.runCommand("/filetraffic " + codeToTraffic);
  return;
}

if (incomingText.indexOf("/delbot_") === 0) {
  var bIdx = incomingText.replace("/delbot_", "");
  Bot.runCommand("/delbot " + bIdx);
  return;
}

if (incomingText.indexOf("/delchannel_") === 0) {
  var cIdx = incomingText.replace("/delchannel_", "");
  Bot.runCommand("/delchannel " + cIdx);
  return;
}

// Default fallback for any unrecognized text
var defaultKeyboard = (isUserAdmin) ? [
  [
    { text: "📁 My Files", style: "primary" },
    { text: "📤 Upload File", style: "success" },
    { text: "📊 My Traffic", style: "primary" }
  ],
  [
    { text: "🤖 My Bots", style: "primary" },
    { text: "📊 Bot Stats", style: "primary" },
    { text: "ℹ️ Help", style: "primary" }
  ],
  [
    { text: "👑 Admin Panel", style: "primary" },
    { text: "📦 Storage DB", style: "success" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
] : [
  [
    { text: "📁 My Files", style: "primary" },
    { text: "📤 Upload File", style: "success" },
    { text: "📊 My Traffic", style: "primary" }
  ],
  [
    { text: "🤖 My Bots", style: "primary" },
    { text: "ℹ️ Help", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "🤖 <b>Welcome to File Share Bot!</b>\n\n" +
    "• Send or forward any <b>document, video, audio, or photo</b> to upload and get your link instantly.\n" +
    "• Use the menu below to navigate:",
  parse_mode: "html",
  reply_markup: {
    keyboard: defaultKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
