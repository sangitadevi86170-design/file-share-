/*CMD
  command: /stats
  help: View bot statistics and status
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 📊 Bot Stats, Bot Stats
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
var locked = Bot.getProperty("locked_buttons") || {};

if (locked.stats && user.telegramid != adminId) {
  Bot.sendMessage("🔒 <b>Feature Locked:</b> Statistics view is currently locked by the administrator.", { parse_mode: "html" });
  return;
}

var userList = Bot.getProperty("user_list") || [];
var totalFiles = Bot.getProperty("total_files") || 0;
var channels = Bot.getProperty("fsub_channels") || [];
var downloadLogs = Bot.getProperty("download_logs") || [];
var botUsername = Bot.getProperty("bot_username") || "FileShareBot";

var statsMessage = "📊 <b>BOT SYSTEM STATISTICS</b>\n\n" +
  "🤖 <b>Bot:</b> @" + botUsername + "\n" +
  "👥 <b>Total Users:</b> " + userList.length + "\n" +
  "📁 <b>Total Files Stored:</b> " + totalFiles + "\n" +
  "📢 <b>Force Join Channels:</b> " + channels.length + " configured\n" +
  "📥 <b>Recent Download Events:</b> " + downloadLogs.length + "\n" +
  "⚡ <b>Platform:</b> Bots.Business Cloud (.bb)\n" +
  "🟢 <b>Status:</b> Online & Operational\n\n" +
  "<i>Powered by Bots.Business (BJS Engine)</i>";

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
  text: statsMessage,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
