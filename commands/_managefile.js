/*CMD
  command: /managefile
  help: Manage and edit a stored file
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var fileCode = params ? params.trim() : "";
if (!fileCode) {
  Bot.sendMessage(
    "📁 <b>Manage File Usage:</b>\n\nSend: <code>/managefile &lt;file_code&gt;</code>\nOr view all files via /files to select one.",
    { parse_mode: "html" }
  );
  return;
}

var fileData = Bot.getProperty("file_" + fileCode);
if (!fileData) {
  Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code> does not exist.", { parse_mode: "html" });
  return;
}

var botUsername = Bot.getProperty("bot_username") || "YourBot";
var shareUrl = "https://t.me/" + botUsername + "?start=" + fileCode;

var text = "📁 <b>FILE MANAGER:</b> <code>" + (fileData.name || "Untitled") + "</code>\n\n" +
  "• <b>File Code:</b> <code>" + fileCode + "</code>\n" +
  "• <b>Media Type:</b> " + (fileData.type || "document").toUpperCase() + "\n" +
  "• <b>File Size:</b> " + (fileData.size || "Unknown") + "\n" +
  "• <b>Total Downloads:</b> " + (fileData.downloads || 0) + "\n" +
  "• <b>Uploaded By:</b> <code>" + (fileData.uploaded_by || "Admin") + "</code>\n" +
  "• <b>Upload Date:</b> " + (fileData.uploaded_at ? fileData.uploaded_at.substring(0, 10) : "N/A") + "\n" +
  "• <b>Current Caption:</b> " + (fileData.caption ? ("<i>" + fileData.caption + "</i>") : "<i>None</i>") + "\n\n" +
  "🔗 <b>Share Link:</b>\n<code>" + shareUrl + "</code>";

var buttons = [
  [
    { text: "✏️ Rename File", callback_data: "/renamefile " + fileCode, style: "primary" },
    { text: "📝 Edit Caption", callback_data: "/setcaption " + fileCode, style: "primary" }
  ],
  [
    { text: "🗑️ Delete File", callback_data: "/deletefile " + fileCode, style: "danger" },
    { text: "🔙 Back to Files", callback_data: "/files", style: "primary" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
