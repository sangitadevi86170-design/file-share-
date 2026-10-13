/*CMD
  command: /traffic
  help: View live user download traffic and logs
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /downloads
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

if (params && params.trim() === "clear") {
  Bot.setProperty("download_logs", [], "json");
  Bot.sendMessage("✅ <b>Download traffic logs cleared!</b>", { parse_mode: "html" });
  return;
}

var logs = Bot.getProperty("download_logs") || [];
var totalFiles = Bot.getProperty("total_files") || 0;

var text = "📈 <b>DOWNLOAD & USER TRAFFIC LOGS</b>\n\n" +
  "📊 <b>Total Logged Events:</b> " + logs.length + " (Showing latest 10)\n" +
  "━━━━━━━━━━━━━━━━━━━━\n\n";

if (logs.length === 0) {
  text += "<i>No downloads recorded yet. As users download files via links, their details will appear here.</i>\n";
} else {
  var displayCount = Math.min(10, logs.length);
  for (var i = 0; i < displayCount; i++) {
    var l = logs[i];
    text += (i + 1) + ". 👤 <b>" + (l.name || "Unknown") + "</b> (" + (l.username || "no username") + ")\n" +
      "   • ID: <code>" + l.user_id + "</code>\n" +
      "   • File: <b>" + l.file_name + "</b> (<code>" + l.file_code + "</code>)\n" +
      "   • Time: <i>" + l.time + "</i>\n\n";
  }
}

var buttons = [
  [
    { text: "🔄 Refresh Logs", callback_data: "/traffic" },
    { text: "🗑️ Clear Logs", callback_data: "/traffic clear" }
  ],
  [
    { text: "🔙 Back to Admin", callback_data: "/admin" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
