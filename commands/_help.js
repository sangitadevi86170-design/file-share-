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
var locked = Bot.getProperty("locked_buttons") || {};

if (locked.help && !isUserAdmin) {
  Bot.sendMessage("🔒 <b>Feature Locked:</b> Help guide is currently locked by the administrator.", { parse_mode: "html" });
  return;
}

var helpText = "📖 <b>FILE SHARING BOT — COMPLETE MANUAL</b>\n\n" +
  "<b>👤 User Commands:</b>\n" +
  "• /start — Start the bot & view main menu\n" +
  "• /help — Show this help manual\n" +
  "• /stats — Check bot system statistics\n" +
  "• /about — Information about this bot\n\n";

if (isUserAdmin) {
  helpText += "<b>👑 Administrator Commands:</b>\n" +
    "• /admin — Open the Admin Control Dashboard\n" +
    "• /files — View uploaded files & management links\n" +
    "• /managefile &lt;code&gt; — Rename, edit caption or delete file\n" +
    "• /fsubchannels — Manage Force Subscribe channels (Public, Private, Request)\n" +
    "• /addchannel — Add new Public/Private/Request channel\n" +
    "• /delchannel — Remove Force Subscribe channel\n" +
    "• /traffic — Real-time user download & traffic tracker\n" +
    "• /buttonlock — Lock / Unlock specific buttons & features\n" +
    "• /protectcontent — Toggle forwarding & saving protection\n" +
    "• /broadcast &lt;text&gt; — Send message to all users\n" +
    "• /publicupload on|off — Toggle user upload access\n" +
    "• /ban &lt;user_id&gt; — Ban an abusive user\n" +
    "• /unban &lt;user_id&gt; — Unban a user\n\n";
}

helpText += "💡 <b>How to get files?</b>\n" +
  "Click any valid link formatted as:\n" +
  "<code>https://t.me/&lt;bot_username&gt;?start=&lt;file_code&gt;</code>";

var buttons = [
  [{ text: "🔙 Back to Home", callback_data: "/start", style: "primary" }]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: helpText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
