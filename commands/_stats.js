/*CMD
  command: /stats
  help: View bot statistics and status
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var userList = Bot.getProperty("user_list") || [];
var totalFiles = Bot.getProperty("total_files") || 0;
var fsubChannel = Bot.getProperty("fsub_channel") || "None (Disabled)";
var botUsername = Bot.getProperty("bot_username") || "FileShareBot";

var statsMessage = "📊 <b>BOT SYSTEM STATISTICS</b>\n\n" +
  "🤖 <b>Bot:</b> @" + botUsername + "\n" +
  "👥 <b>Total Users:</b> " + userList.length + "\n" +
  "📁 <b>Total Files Stored:</b> " + totalFiles + "\n" +
  "📢 <b>Force Join Channel:</b> <code>" + fsubChannel + "</code>\n" +
  "⚡ <b>Platform:</b> Bots.Business Cloud (.bb)\n" +
  "🟢 <b>Status:</b> Online & Operational\n\n" +
  "<i>Powered by Bots.Business (BJS Engine)</i>";

var buttons = [
  [{ text: "🔙 Back to Home", callback_data: "/start" }]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: statsMessage,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
