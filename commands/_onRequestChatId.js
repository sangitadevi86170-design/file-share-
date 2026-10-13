/*CMD
  command: /onRequestChatId
  help: Save private request channel chat ID (Step 1/2) and prompt for request link
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) return;

var chatId = message ? message.trim() : "";
if (!chatId) {
  Bot.sendMessage("⚠️ Chat ID cannot be empty.");
  return;
}

User.setProperty("temp_request_id", chatId, "string");

Bot.sendMessage(
  "🔗 <b>PRIVATE REQUEST CHANNEL SETUP (Step 2 of 2):</b>\n\n" +
  "• Chat ID Saved: <code>" + chatId + "</code>\n\n" +
  "Now please send the <b>Join Request Link</b>:\n" +
  "<i>Example:</i> <code>https://t.me/+RequestLinkJoinHash</code>\n\n" +
  "💡 <i>Users with pending join requests will automatically be approved to download files!</i>",
  { parse_mode: "html" }
);

Bot.runCommand("/onRequestLink");
