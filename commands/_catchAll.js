/*CMD
  command: *
  help: Catch-all command to handle media uploads and unrecognized messages
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// Check if user is banned
var bannedUsers = Bot.getProperty("banned_users") || [];
if (bannedUsers.indexOf(user.telegramid) !== -1) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You are banned from using this bot.", { parse_mode: "html" });
  return;
}

var adminId = Bot.getProperty("admin_id");
var isUserAdmin = (user.telegramid == adminId);
var publicUpload = Bot.getProperty("public_upload"); // true or false
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
  // Check button locker for uploads
  if (lockedButtons.upload && !isUserAdmin) {
    Bot.sendMessage(
      "🔒 <b>Uploads Locked:</b> File uploads are temporarily locked by the administrator.",
      { parse_mode: "html" }
    );
    return;
  }

  // Check permission: Admin or Public Upload enabled
  if (!isUserAdmin && !publicUpload) {
    Bot.sendMessage(
      "⛔ <b>Access Denied: Upload Restricted!</b>\n\n" +
      "Only the Bot Administrator is allowed to upload files.\n" +
      "If you are the bot owner, send /setadmin to claim admin rights.",
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
  var randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
  var timestampCode = (new Date().getTime() % 10000).toString(36).toUpperCase();
  var fileCode = "FS_" + randomCode + timestampCode;

  // Save file record
  var fileData = {
    code: fileCode,
    file_id: fileId,
    type: fileType,
    name: fileName,
    size: sizeText,
    caption: caption,
    uploaded_by: user.telegramid,
    uploaded_at: new Date().toISOString(),
    downloads: 0
  };

  Bot.setProperty("file_" + fileCode, fileData, "json");

  // Update files list & total count
  var filesList = Bot.getProperty("files_list") || [];
  filesList.push(fileCode);
  Bot.setProperty("files_list", filesList, "json");

  var totalFiles = (Bot.getProperty("total_files") || 0) + 1;
  Bot.setProperty("total_files", totalFiles, "integer");

  // Construct share link
  var botUsername = Bot.getProperty("bot_username");
  var shareUrl = botUsername 
    ? ("https://t.me/" + botUsername + "?start=" + fileCode) 
    : ("https://t.me/YourBot?start=" + fileCode);

  var successText = "✅ <b>File Saved Successfully!</b>\n\n" +
    "📁 <b>Name:</b> <code>" + fileName + "</code>\n" +
    "📦 <b>Size:</b> " + sizeText + "\n" +
    "🏷️ <b>Type:</b> " + fileType.toUpperCase() + "\n" +
    "🔑 <b>Code:</b> <code>" + fileCode + "</code>\n\n" +
    "🔗 <b>Shareable Link:</b>\n" +
    "<code>" + shareUrl + "</code>\n\n" +
    "<i>Share this link with anyone to let them access your file instantly!</i>";

  var tgShareLink = "https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent("📁 Get file: " + fileName);

  var buttons = [
    [
      { text: "🚀 Share to Telegram", url: tgShareLink }
    ],
    [
      { text: "⚙️ Manage File", callback_data: "/managefile " + fileCode },
      { text: "🗑️ Delete File", callback_data: "/deletefile " + fileCode }
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
  "🤖 <b>I am ready!</b>\n\n" +
  "• Send or forward any <b>file, document, video, or audio</b> to generate a share link.\n" +
  "• Use /help to see all commands.",
  { parse_mode: "html" }
);
