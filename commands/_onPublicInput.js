/*CMD
  command: /onPublicInput
  help: Save public channel username
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

// Check for cancel or navigation buttons
if (!input || input === "/cancel" || input.indexOf("Back to Channels") !== -1 || input.indexOf("Force Channels") !== -1 || input.indexOf("Cancel") !== -1) {
  User.setProperty("admin_state", null, "string");
  Bot.sendMessage("❌ Channel addition cancelled.", { parse_mode: "html" });
  Bot.runCommand("/fsubchannels");
  return;
}
if (input.indexOf("Admin Panel") !== -1) {
  User.setProperty("admin_state", null, "string");
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Main Menu") !== -1) {
  User.setProperty("admin_state", null, "string");
  Bot.runCommand("/start");
  return;
}

var cleanHandle = input.replace("@", "").trim();
// If input was a URL like https://t.me/MyChannel
if (cleanHandle.indexOf("t.me/") !== -1) {
  cleanHandle = cleanHandle.split("t.me/")[1].replace("/", "").trim();
}

if (!cleanHandle) {
  Bot.sendMessage("⚠️ <b>Invalid username!</b> Please send a valid channel username (e.g. <code>@MyChannel</code>):", { parse_mode: "html" });
  Bot.run({ command: "/onPublicInput" });
  return;
}

var chId = "@" + cleanHandle;
var chLink = "https://t.me/" + cleanHandle;

var channels = Bot.getProperty("fsub_channels") || [];
var exists = false;
for (var i = 0; i < channels.length; i++) {
  if (channels[i].id.toLowerCase() === chId.toLowerCase()) {
    channels[i].link = chLink;
    channels[i].type = "public";
    channels[i].title = chId;
    exists = true;
    break;
  }
}

if (!exists) {
  channels.push({
    id: chId,
    link: chLink,
    title: chId,
    type: "public"
  });
}

Bot.setProperty("fsub_channels", channels, "json");
Bot.setProperty("fsub_channel", chId, "string");
User.setProperty("admin_state", null, "string");

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
  text: "✅ <b>Public Channel Added Successfully!</b>\n\n" +
    "• <b>Type:</b> 🌐 PUBLIC\n" +
    "• <b>Username:</b> <code>" + chId + "</code>\n" +
    "• <b>Link:</b> " + chLink + "\n\n" +
    "Users will now be required to join this channel before accessing shared files.",
  parse_mode: "html",
  reply_markup: {
    keyboard: fsubKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});

Bot.runCommand("/fsubchannels");
