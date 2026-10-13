/*CMD
  command: /addbot
  help: Prompt admin to enter bot details for the network list
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var navKeyboard = [
  [
    { text: "🤖 My Bots", style: "primary" },
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "🤖 <b>ADD NEW BOT TO 'MY BOTS':</b>\n\n" +
    "Please send the bot username and title in this format:\n" +
    "<code>@BotUsername Bot Title</code>\n\n" +
    "<i>Example:</i> <code>@MovieFinderBot Movies & Series Finder</code>\n" +
    "<i>(Or simply send <code>@MovieFinderBot</code>)</i>\n\n" +
    "<i>Or tap [ 🤖 My Bots ] to cancel.</i>",
  parse_mode: "html",
  reply_markup: {
    keyboard: navKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});

Bot.run({ command: "/onSaveBot" });
