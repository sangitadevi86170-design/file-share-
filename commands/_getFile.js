/*CMD
  command: /getFile
  help: Retrieve and send the requested file to user
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var fileCode = params;
if (!fileCode) {
  Bot.sendMessage("⚠️ <b>No file code provided!</b>", { parse_mode: "html" });
  return;
}

fileCode = fileCode.trim();
var fileData = Bot.getProperty("file_" + fileCode);

if (!fileData) {
  Bot.sendMessage(
    "❌ <b>Error: File Not Found!</b>\n\n" +
    "The requested file does not exist, or it has been deleted by the administrator.\n" +
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

var caption = fileData.caption;
if (!caption) {
  caption = "📁 <b>" + (fileData.name || "Shared File") + "</b>\n" +
    "⚡ <i>Sent via File Share Bot</i>";
}

// Dispatch file based on media type
var mediaType = fileData.type || "document";

if (mediaType === "document") {
  Api.sendDocument({
    chat_id: chat.chatid,
    document: fileData.file_id,
    caption: caption,
    parse_mode: "html"
  });
} else if (mediaType === "video") {
  Api.sendVideo({
    chat_id: chat.chatid,
    video: fileData.file_id,
    caption: caption,
    parse_mode: "html"
  });
} else if (mediaType === "photo") {
  Api.sendPhoto({
    chat_id: chat.chatid,
    photo: fileData.file_id,
    caption: caption,
    parse_mode: "html"
  });
} else if (mediaType === "audio") {
  Api.sendAudio({
    chat_id: chat.chatid,
    audio: fileData.file_id,
    caption: caption,
    parse_mode: "html"
  });
} else if (mediaType === "voice") {
  Api.sendVoice({
    chat_id: chat.chatid,
    voice: fileData.file_id,
    caption: caption,
    parse_mode: "html"
  });
} else {
  // Fallback to sendDocument
  Api.sendDocument({
    chat_id: chat.chatid,
    document: fileData.file_id,
    caption: caption,
    parse_mode: "html"
  });
}
