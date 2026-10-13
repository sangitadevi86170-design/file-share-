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
  Bot.sendMessage("✅ <b>Download traffic logs have been cleared!</b>", { parse_mode: "html" });
  return;
}

var logs = Bot.getProperty("download_logs") || [];

var text = "📈 <b>LIVE USER DOWNLOAD & TRAFFIC LOGS</b>\n\n" +
  "📊 <b>Total Download Events Logged:</b> " + logs.length + " (Showing latest 10)\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

if (logs.length === 0) {
  text += "<i>No downloads recorded yet. As users download files via your bot links, their full info (Name, Chat ID, Username, Exact Time) will appear here.</i>\n";
} else {
  var displayCount = Math.min(10, logs.length);
  for (var i = 0; i < displayCount; i++) {
    var l = logs[i];
    text += "🔹 <b>EVENT #" + (i + 1) + ":</b>\n" +
      "   • 👤 <b>Name:</b> " + (l.name || "Unknown") + "\n" +
      "   • 💬 <b>Username:</b> " + (l.username || "No username") + "\n" +
      "   • 🆔 <b>Chat ID / User ID:</b> <code>" + (l.chat_id || l.user_id) + "</code>\n" +
      "   • 📁 <b>File:</b> <code>" + (l.file_name || "File") + "</code>\n" +
      "   • 🔑 <b>Code:</b> <code>" + l.file_code + "</code> | " + (l.file_size || "") + " [" + (l.file_type || "") + "]\n" +
      "   • ⏰ <b>Downloaded At:</b> <i>" + l.time + "</i>\n" +
      "────────────────────────────\n";
  }
}

var buttons = [
  [
    { text: "🔄 Refresh Traffic", callback_data: "/traffic", style: "primary" },
    { text: "🗑️ Clear All Logs", callback_data: "/traffic clear", style: "danger" }
  ],
  [
    { text: "🔙 Back to Admin", callback_data: "/admin", style: "primary" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
