/*CMD
  command: /getFile
  help: Retrieve and send the requested file to user with traffic logging
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
var lockedButtons = Bot.getProperty("locked_buttons") || {};

// Check if download is locked for regular users
if (lockedButtons.download && user.telegramid != adminId) {
  Bot.sendMessage("🔒 <b>Access Restricted:</b> File downloads are temporarily locked by the administrator.", { parse_mode: "html" });
  return;
}

// Check if user is banned
var bannedUsers = Bot.getProperty("banned_users") || [];
if (bannedUsers.indexOf(user.telegramid) !== -1) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You are banned from downloading files from this bot.", { parse_mode: "html" });
  return;
}

var fileCode = params;
if (!fileCode) {
  Bot.sendMessage("⚠️ <b>No file code provided!</b>", { parse_mode: "html" });
  return;
}

fileCode = fileCode.trim();
if (fileCode.indexOf("start=") === 0) {
  fileCode = fileCode.replace("start=", "").trim();
}

var fileData = Bot.getProperty("file_" + fileCode);

// If not in bot properties, check if code itself is a direct Telegram file_id (smart fallback)
if (!fileData) {
  if (fileCode.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(fileCode)) {
    // Attempt sending directly via Telegram file_id
    try {
      Api.sendDocument({
        chat_id: chat.chatid,
        document: fileCode,
        caption: "📁 <b>Delivered via Telegram File ID</b>\n⚡ <i>Sent via File Share Bot</i>",
        parse_mode: "html"
      });
      return;
    } catch (e) {}
  }

  Bot.sendMessage(
    "❌ <b>Error: File Not Found!</b>\n\n" +
    "The requested file does not exist, or it has been deleted by the owner.\n" +
    "Please check your link and try again.",
    { parse_mode: "html" }
  );
  return;
}

// Clear user requested file state
User.setProperty("requested_file", null, "string");

// Increment download counter
fileData.downloads = (fileData.downloads || 0) + 1;
Bot.setProperty("file_" + fileCode, fileData, "json");

// Format exact timestamp with AM/PM
var now = new Date();
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var hours = now.getHours();
var minutes = now.getMinutes();
var seconds = now.getSeconds();
var ampm = hours >= 12 ? "PM" : "AM";
hours = hours % 12;
hours = hours ? hours : 12;
var formattedTime = now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear() + ", " +
  (hours < 10 ? "0" + hours : hours) + ":" +
  (minutes < 10 ? "0" + minutes : minutes) + ":" +
  (seconds < 10 ? "0" + seconds : seconds) + " " + ampm;

var fullName = (user.first_name || "") + (user.last_name ? (" " + user.last_name) : "");
if (!fullName.trim()) fullName = "User " + user.telegramid;
var userHandle = user.username ? ("@" + user.username) : "No username";

var logItem = {
  chat_id: chat.chatid,
  user_id: user.telegramid,
  downloader_id: user.telegramid,
  downloader_name: fullName.trim(),
  downloader_username: userHandle,
  name: fullName.trim(),
  username: userHandle,
  file_code: fileCode,
  file_name: fileData.name || "File",
  file_size: fileData.size || "Unknown",
  file_type: (fileData.type || "document").toUpperCase(),
  time: formattedTime
};

// 1. Global download logs (For Admin /traffic)
var downloadLogs = Bot.getProperty("download_logs") || [];
downloadLogs.unshift(logItem);
if (downloadLogs.length > 50) downloadLogs.pop();
Bot.setProperty("download_logs", downloadLogs, "json");

// 2. Per-file traffic logs (For /filetraffic <code_id>)
var fileLogs = Bot.getProperty("file_traffic_" + fileCode) || [];
fileLogs.unshift(logItem);
if (fileLogs.length > 50) fileLogs.pop();
Bot.setProperty("file_traffic_" + fileCode, fileLogs, "json");

// 3. Uploader personal traffic logs (For /usertraffic)
if (fileData.uploaded_by) {
  var uploaderLogs = Bot.getProperty("user_traffic_" + fileData.uploaded_by) || [];
  uploaderLogs.unshift(logItem);
  if (uploaderLogs.length > 50) uploaderLogs.pop();
  Bot.setProperty("user_traffic_" + fileData.uploaded_by, uploaderLogs, "json");
}

// Content protection setting
var protectContent = Bot.getProperty("protect_content") || false;

var caption = fileData.caption;
if (!caption) {
  caption = "📁 <b>" + (fileData.name || "Shared File") + "</b>\n" +
    "⚡ <i>Sent via File Share Bot</i>";
}

// Dispatch file based on media type
var mediaType = fileData.type || "document";
var sendFileId = fileData.file_id || fileCode;

if (mediaType === "document") {
  Api.sendDocument({
    chat_id: chat.chatid,
    document: sendFileId,
    caption: caption,
    parse_mode: "html",
    protect_content: protectContent
  });
} else if (mediaType === "video") {
  Api.sendVideo({
    chat_id: chat.chatid,
    video: sendFileId,
    caption: caption,
    parse_mode: "html",
    protect_content: protectContent
  });
} else if (mediaType === "photo") {
  Api.sendPhoto({
    chat_id: chat.chatid,
    photo: sendFileId,
    caption: caption,
    parse_mode: "html",
    protect_content: protectContent
  });
} else if (mediaType === "audio") {
  Api.sendAudio({
    chat_id: chat.chatid,
    audio: sendFileId,
    caption: caption,
    parse_mode: "html",
    protect_content: protectContent
  });
} else if (mediaType === "voice") {
  Api.sendVoice({
    chat_id: chat.chatid,
    voice: sendFileId,
    caption: caption,
    parse_mode: "html",
    protect_content: protectContent
  });
} else {
  Api.sendDocument({
    chat_id: chat.chatid,
    document: sendFileId,
    caption: caption,
    parse_mode: "html",
    protect_content: protectContent
  });
}
