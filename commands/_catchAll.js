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
var isUserAdmin = (user.telegramid == adminId);
var lockedButtons = Bot.getProperty("locked_buttons") || {};

// Check if message contains media
var msg = (request && request.message) ? request.message : null;
var doc = msg ? msg.document : null;
var video = msg ? msg.video : null;
var photo = (msg && msg.photo && msg.photo.length > 0) ? msg.photo : null;
var audio = msg ? msg.audio : null;
var voice = msg ? msg.voice : null;

var hasMedia = (doc || video || photo || audio || voice);

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
  var caption = msg.caption || "";

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
  } else if (photo) {
    fileType = "photo";
    fileId = photo[photo.length - 1].file_id;
    fileName = "Photo.jpg";
    fileSize = photo[photo.length - 1].file_size || 0;
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

  var botUsername = Bot.getProperty("bot_username") || "YourBot";
  var shareUrl = "https://t.me/" + botUsername + "?start=" + fileCode;

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
    "🔗 <b>Shareable Link:</b>\n" +
    "<code>" + shareUrl + "</code>\n\n" +
    "<i>Anyone clicking this link will be able to download your file! You can manage this file or view who downloaded it anytime in <b>My Files</b>.</i>";

  var tgShareLink = "https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent("📁 Get file: " + fileName);

  var buttons = [
    [
      { text: "🚀 Share to Telegram", url: tgShareLink, style: "success" }
    ],
    [
      { text: "⚙️ Manage File", callback_data: "/managefile " + fileCode, style: "primary" },
      { text: "📁 My Files", callback_data: "/myfiles", style: "primary" }
    ],
    [
      { text: "🗑️ Delete File", callback_data: "/deletefile " + fileCode, style: "danger" }
    ]
  ];

  Api.sendMessage({
    chat_id: chat.chatid,
    text: successText,
    parse_mode: "html",
    reply_markup: { inline_keyboard: buttons }
  });
  return;
}

// Fallback for general text messages
var incomingText = message || "";
if (incomingText.indexOf("/del_") === 0) {
  var codeToDel = incomingText.replace("/del_", "");
  Bot.runCommand("/deletefile " + codeToDel);
  return;
}

// If user sent unrecognized text
Bot.sendMessage(
  "🤖 <b>Welcome to File Share Bot!</b>\n\n" +
  "• Send or forward any <b>file, document, video, or audio</b> to upload and generate a download link.\n" +
  "• Use /myfiles to view and manage your uploaded files.\n" +
  "• Use /help to see all commands.",
  { parse_mode: "html" }
);
