/*CMD
  command: /onPrivateChatId
  help: Save private channel chat ID (Step 1/2) and prompt for invite link
  need_reply: false
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

// Check for cancel / back navigation buttons
if (!chatId || chatId === "/cancel" || chatId.indexOf("Back") !== -1 || chatId.indexOf("Cancel") !== -1) {
  Bot.sendMessage("❌ Channel addition cancelled.", { parse_mode: "html" });
  Bot.runCommand("/fsubchannels");
  return;
}
if (chatId.indexOf("Admin") !== -1) {
  Bot.runCommand("/admin");
  return;
}
if (chatId.indexOf("Menu") !== -1) {
  Bot.runCommand("/start");
  return;
}

User.setProperty("temp_private_id", chatId, "string");

var navKeyboard = [
  [
    { text: "🔙 Back to Channels", style: "primary" },
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "🔗 <b>PRIVATE CHANNEL SETUP (Step 2 of 2):</b>\n\n" +
    "• Chat ID Saved: <code>" + chatId + "</code>\n\n" +
    "Now please send the Private Channel's <b>Invite Link</b>:\n" +
    "<i>Example:</i> <code>https://t.me/+AbCdEfGhIjKlMn</code>\n\n" +
    "<i>Or tap [ 🔙 Back to Channels ] below to cancel.</i>",
  parse_mode: "html",
  reply_markup: {
    keyboard: navKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});

Bot.run({ command: "/onPrivateLink" });
