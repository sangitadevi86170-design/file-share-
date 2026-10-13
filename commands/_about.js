/*CMD
  command: /about
  help: Information about the bot
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 🤖 About Bot, About Bot
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
var locked = Bot.getProperty("locked_buttons") || {};

if (locked.about && user.telegramid != adminId) {
  Bot.sendMessage("🔒 <b>Feature Locked:</b> About info is currently locked by the administrator.", { parse_mode: "html" });
  return;
}

var aboutText = "🤖 <b>ABOUT FILE SHARE BOT (.BB)</b>\n\n" +
  "• <b>Bot Type:</b> Advanced Telegram File Store & Sharing Bot\n" +
  "• <b>Engine:</b> Bots.Business BJS (Bot Java Script)\n" +
  "• <b>Hosting:</b> Cloud Hosted on Bots.Business (.bb)\n" +
  "• <b>Storage:</b> Telegram Bot API Cloud Storage (Permanent)\n" +
  "• <b>Security:</b> Multi-Channel Lock (Public, Private, Request Channels)\n" +
  "• <b>Analytics:</b> Live User Download & Traffic Tracker\n" +
  "• <b>Controls:</b> File Manager (Rename, Captions) & Button Locker\n\n" +
  "✨ <i>Fast, 24/7 online, zero hosting costs!</i>";

var buttons = [
  [
    { text: "🤖 My Bots", callback_data: "/mybots", style: "primary" },
    { text: "📊 Bot Stats", callback_data: "/stats", style: "primary" },
    { text: "🔙 Main Menu", callback_data: "/start", style: "primary" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: aboutText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
