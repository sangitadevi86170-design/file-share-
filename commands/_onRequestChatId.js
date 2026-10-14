/*CMD
  command: /onRequestChatId
  help: Save request channel chat ID and prompt for join-request link
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var isUserAdmin = (String(user.telegramid) === "8710308658" || String(user.telegramid) === String(Bot.getProperty("admin_id")));
if (!isUserAdmin) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var input = "";
if (typeof message === "string") {
  input = message.trim();
} else if (typeof message === "object" && message && message.text) {
  input = message.text.trim();
} else if (typeof request !== "undefined" && request && request.text) {
  input = request.text.trim();
} else if (typeof request !== "undefined" && request && request.message && request.message.text) {
  input = request.message.text.trim();
}

if (!input || input === "/cancel" || input.indexOf("Back to Channels") !== -1 || input.indexOf("Force Channels") !== -1 || input.indexOf("Cancel") !== -1) {
  User.setProperty("admin_state", null, "string");
  User.setProperty("temp_request_id", null, "string");
  Bot.sendMessage("❌ Channel addition cancelled.", { parse_mode: "html" });
  Bot.runCommand("/fsubchannels");
  return;
}
if (input.indexOf("Admin Panel") !== -1) {
  User.setProperty("admin_state", null, "string");
  User.setProperty("temp_request_id", null, "string");
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Main Menu") !== -1) {
  User.setProperty("admin_state", null, "string");
  User.setProperty("temp_request_id", null, "string");
  Bot.runCommand("/start");
  return;
}

User.setProperty("temp_request_id", input, "string");
User.setProperty("admin_state", "waiting_request_link", "string");
Bot.run({ command: "/onRequestLink" });

var navKeyboard = [
  [
    { text: "🔙 Back to Channels", style: "primary" },
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "📝 <b>PRIVATE REQUEST CHANNEL SETUP (Step 2 of 2):</b>\n\n" +
    "• <b>Chat ID Saved:</b> <code>" + input + "</code>\n\n" +
    "Now please send the <b>Join Request Link</b>:\n" +
    "<i>Example:</i> <code>https://t.me/+RequestJoinHash</code>\n\n" +
    "💡 <i>Users with pending join requests will automatically be approved to download files!</i>\n\n" +
    "<i>Or tap [ 🔙 Back to Channels ] to cancel.</i>",
  parse_mode: "html",
  reply_markup: {
    keyboard: navKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
