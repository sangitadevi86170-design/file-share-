/*CMD
  command: /onPrivateLink
  help: Save private channel invite link and complete setup
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
  User.setProperty("temp_private_id", null, "string");
  Bot.sendMessage("❌ Channel addition cancelled.", { parse_mode: "html" });
  Bot.runCommand("/fsubchannels");
  return;
}
if (input.indexOf("Admin Panel") !== -1) {
  User.setProperty("admin_state", null, "string");
  User.setProperty("temp_private_id", null, "string");
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Main Menu") !== -1) {
  User.setProperty("admin_state", null, "string");
  User.setProperty("temp_private_id", null, "string");
  Bot.runCommand("/start");
  return;
}

var privId = User.getProperty("temp_private_id") || "Private Channel";
User.setProperty("temp_private_id", null, "string");
User.setProperty("admin_state", null, "string");

var channels = Bot.getProperty("fsub_channels") || [];
channels.push({
  id: privId,
  link: input,
  title: "Private Channel (" + privId + ")",
  type: "private"
});
Bot.setProperty("fsub_channels", channels, "json");
Bot.setProperty("fsub_channel", privId, "string");

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
  text: "✅ <b>Private Channel Added Successfully!</b>\n\n" +
    "• <b>Type:</b> 🔒 PRIVATE\n" +
    "• <b>Chat ID:</b> <code>" + privId + "</code>\n" +
    "• <b>Invite Link:</b> " + input,
  parse_mode: "html",
  reply_markup: {
    keyboard: fsubKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});

Bot.runCommand("/fsubchannels");
