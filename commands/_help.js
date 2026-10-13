/*CMD
  command: /help
  help: View all available commands and help guide
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
var isUserAdmin = (user.telegramid == adminId);

var helpText = "📖 <b>FILE SHARING BOT — HELP MANUAL</b>\n\n" +
  "<b>👤 User Commands:</b>\n" +
  "• /start — Start the bot & view main menu\n" +
  "• /help — Show this help manual\n" +
  "• /stats — Check bot system statistics\n" +
  "• /about — Information about this bot\n\n";

if (isUserAdmin) {
  helpText += "<b>👑 Administrator Commands:</b>\n" +
    "• /admin — Open the Admin Control Panel\n" +
    "• /setchannel @channel — Set Force Subscribe Channel\n" +
    "• /delchannel — Remove Force Subscribe Channel\n" +
    "• /broadcast &lt;text&gt; — Broadcast message to all users\n" +
    "• /files — List latest uploaded files\n" +
    "• /deletefile &lt;code&gt; — Delete a file from storage\n" +
    "• /publicupload on|off — Toggle user upload access\n" +
    "• /setadmin &lt;id&gt; — Transfer admin ownership\n\n";
}

helpText += "💡 <b>How to get files?</b>\n" +
  "Click any valid link formatted as:\n" +
  "<code>https://t.me/&lt;bot_username&gt;?start=&lt;file_code&gt;</code>";

var buttons = [
  [{ text: "🔙 Back to Home", callback_data: "/start" }]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: helpText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
