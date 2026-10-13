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

var buttons = [
  [
    { text: "📁 My Files", callback_data: "/myfiles", style: "primary" },
    { text: "🤖 My Bots", callback_data: "/mybots", style: "primary" },
    { text: "🔙 Main Menu", callback_data: "/start", style: "primary" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: statsMessage,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
