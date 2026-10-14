/*CMD
  command: /onRequestLink
  help: Save request channel link and complete setup
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

var reqId = User.getProperty("temp_request_id") || "Request Channel";
User.setProperty("temp_request_id", null, "string");
User.setProperty("admin_state", null, "string");

var channels = Bot.getProperty("fsub_channels") || [];
channels.push({
  id: reqId,
  link: input,
  title: "Request Channel (" + reqId + ")",
  type: "request"
});
Bot.setProperty("fsub_channels", channels, "json");
Bot.setProperty("fsub_channel", reqId, "string");

var fsubKeyboard = [
  [
    { text: "🌐 Public Channel", style: "primary" },
    { text: "🔒 Private Channel", style: "primary" },
    { text: "📝 Request Channel", style: "primary" }
  ],
  [
    { text: "🗑️ Remove All Channels", style: "danger" },
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "✅ <b>Private Request Channel Added Successfully!</b>\n\n" +
    "• <b>Type:</b> 📝 PRIVATE REQUEST (Approval Mode)\n" +
    "• <b>Chat ID:</b> <code>" + reqId + "</code>\n" +
    "• <b>Request Link:</b> " + input + "\n\n" +
    "💡 <i>Users with pending join requests will automatically unlock files!</i>",
  parse_mode: "html",
  reply_markup: {
    keyboard: fsubKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});

Bot.runCommand("/fsubchannels");
