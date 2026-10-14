/*CMD
  command: /onSaveHelp
  help: Save the new support username entered by admin
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var isUserAdmin = (String(user.telegramid) === "8710308658" || String(user.telegramid) === String(Bot.getProperty("admin_id")));
if (!isUserAdmin) return;

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

User.setProperty("admin_state", null, "string");

if (!input || input === "/cancel" || input.indexOf("Cancel") !== -1 || input.indexOf("Admin Panel") !== -1) {
  Bot.sendMessage("❌ Operation cancelled. Returning to Admin Panel.", { parse_mode: "html" });
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Main Menu") !== -1) {
  Bot.runCommand("/start");
  return;
}

var cleanUser = input.replace("@", "").trim();
Bot.setProperty("support_username", cleanUser, "string");

var adminReplyKeyboard = [
  [
    { text: "📁 All Files", style: "primary" },
    { text: "📈 All Traffic", style: "primary" },
    { text: "📢 Force Channels", style: "primary" }
  ],
  [
    { text: "🔐 Button Locker", style: "primary" },
    { text: "🛡️ Protect Content", style: "primary" },
    { text: "📦 Storage DB", style: "success" }
  ],
  [
    { text: "💬 Set Support", style: "primary" },
    { text: "📢 Broadcast", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "✅ <b>Support Contact Updated Successfully!</b>\n\n" +
    "• <b>New Support Username:</b> @" + cleanUser + "\n" +
    "• Users clicking <b>ℹ️ Help</b> will now directly see: <a href=\"https://t.me/" + cleanUser + "\">@" + cleanUser + "</a>",
  parse_mode: "html",
  reply_markup: {
    keyboard: adminReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
