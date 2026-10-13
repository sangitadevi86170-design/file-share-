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

var text = "🤖 <b>ADD NEW BOT TO 'MY BOTS':</b>\n\n" +
  "Please send the bot username and title in this format:\n" +
  "<code>@BotUsername Bot Title</code>\n\n" +
  "<i>Example:</i> <code>@MovieFinderBot Movies & Series Finder</code>\n" +
  "<i>(Or simply send <code>@MovieFinderBot</code>)</i>";

Bot.sendMessage(text, { parse_mode: "html" });
Bot.runCommand("/onSaveBot");
