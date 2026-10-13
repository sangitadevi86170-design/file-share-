/*CMD
  command: /onPrivateChatId
  help: Save private channel chat ID (Step 1/2) and prompt for invite link
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

User.setProperty("temp_private_id", chatId, "string");

Bot.sendMessage(
  "🔗 <b>PRIVATE CHANNEL SETUP (Step 2 of 2):</b>\n\n" +
  "• Chat ID Saved: <code>" + chatId + "</code>\n\n" +
  "Now please send the Private Channel's <b>Invite Link</b>:\n" +
  "<i>Example:</i> <code>https://t.me/+AbCdEfGhIjKlMn</code>",
  { parse_mode: "html" }
);

Bot.runCommand("/onPrivateLink");
