/*CMD
  command: /about
  help: Information about the bot
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var aboutText = "🤖 <b>ABOUT FILE SHARE BOT (.BB)</b>\n\n" +
  "• <b>Bot Type:</b> Telegram File Store & Sharing Bot\n" +
  "• <b>Engine:</b> Bots.Business BJS (Bot Java Script)\n" +
  "• <b>Hosting:</b> Cloud Hosted on Bots.Business (.bb)\n" +
  "• <b>Storage:</b> Telegram Bot API Cloud Storage (Permanent)\n" +
  "• <b>Security:</b> Force Subscribe (FSUB) Channel Lock\n\n" +
  "✨ <i>Fast, 24/7 online, zero hosting costs!</i>";

var buttons = [
  [{ text: "🔙 Back to Home", callback_data: "/start" }]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: aboutText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
