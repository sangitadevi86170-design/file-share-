/*CMD
  command: /usertraffic
  help: View download traffic for your uploaded files
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 📊 My Traffic, My Traffic
  group: 
CMD*/

var bannedUsers = Bot.getProperty("banned_users") || [];
if (bannedUsers.indexOf(user.telegramid) !== -1) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You are banned from using this bot.", { parse_mode: "html" });
  return;
}

var userDownloads = Bot.getProperty("user_traffic_" + user.telegramid) || [];

var text = "📊 <b>MY FILES DOWNLOAD TRAFFIC</b>\n\n" +
  "Here is the live record of users who downloaded your shared files:\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

if (userDownloads.length === 0) {
  text += "<i>No downloads recorded for your files yet.\nShare your file links to start tracking traffic!</i>\n";
} else {
  var displayCount = Math.min(10, userDownloads.length);
  for (var i = 0; i < displayCount; i++) {
    var item = userDownloads[i];
    text += (i + 1) + ". 📁 <b>" + (item.file_name || "File") + "</b> (<code>" + (item.file_code || "") + "</code>)\n" +
      "   • 👤 <b>Downloaded By:</b> " + (item.downloader_name || "User") + " (" + (item.downloader_username || "no username") + ")\n" +
      "   • 🆔 <b>Chat ID:</b> <code>" + (item.downloader_id || item.user_id) + "</code>\n" +
      "   • ⏰ <b>Time:</b> <i>" + item.time + "</i>\n" +
      "────────────────────────────\n";
  }
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
var replyKeyboard = (user.telegramid == adminId) ? [
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
    { text: "📊 Bot Stats", style: "primary" },
    { text: "ℹ️ Help", style: "primary" }
  ],
  [
    { text: "🤖 About Bot", style: "primary" },
    { text: "🔄 Refresh", style: "success" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
