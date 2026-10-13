/*CMD
  command: /filetraffic
  help: View download traffic for a specific file
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var fileCode = params ? params.trim() : "";
if (!fileCode) {
  Bot.sendMessage("⚠️ <b>Usage:</b> <code>/filetraffic &lt;file_code&gt;</code>", { parse_mode: "html" });
  return;
}

var fileData = Bot.getProperty("file_" + fileCode);
if (!fileData) {
  Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code>", { parse_mode: "html" });
  return;
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isOwner = (fileData.uploaded_by == user.telegramid);
var isAdmin = (user.telegramid == adminId);

// Only file owner or admin can view file downloaders
if (!isOwner && !isAdmin) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You can only view traffic for your own files.", { parse_mode: "html" });
  return;
}

var logs = Bot.getProperty("file_traffic_" + fileCode) || [];

var text = "📊 <b>DOWNLOAD TRAFFIC FOR:</b> <code>" + (fileData.name || fileCode) + "</code>\n\n" +
  "• <b>Total Downloads:</b> " + (fileData.downloads || 0) + "\n" +
  "• <b>Logged Events:</b> " + logs.length + " (Showing latest 10)\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

if (logs.length === 0) {
  text += "<i>No downloads recorded for this file yet.</i>\n";
} else {
  var displayCount = Math.min(10, logs.length);
  for (var i = 0; i < displayCount; i++) {
    var l = logs[i];
    text += (i + 1) + ". 👤 <b>" + (l.downloader_name || "User") + "</b> (" + (l.downloader_username || "no username") + ")\n" +
      "   • 🆔 <b>Chat ID:</b> <code>" + (l.downloader_id || "") + "</code>\n" +
      "   • ⏰ <b>Downloaded At:</b> <i>" + l.time + "</i>\n" +
      "────────────────────────────\n";
  }
}

var buttons = [
  [
    { text: "⚙️ Manage File", callback_data: "/managefile " + fileCode, style: "primary" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
