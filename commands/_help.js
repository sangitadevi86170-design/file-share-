/*CMD
  command: /help
  help: View support and help contact
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: ℹ️ Help, Help
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isUserAdmin = (user.telegramid == adminId);
var locked = Bot.getProperty("locked_buttons") || {};

if (locked.help && !isUserAdmin) {
  Bot.sendMessage("🔒 <b>Feature Locked:</b> Help support is currently locked by the administrator.", { parse_mode: "html" });
  return;
}

var supportUsername = Bot.getProperty("support_username") || "sangitadevi86170";
var cleanUser = supportUsername.replace("@", "").trim();

var helpText = "ℹ️ <b>NEED HELP OR SUPPORT?</b>\n\n" +
  "Agar aapko koi bhi help ya issue ho, toh direct support par message karein:\n\n" +
  "💬 <b>Support Contact:</b> @" + cleanUser + "\n\n" +
  "👉 <a href=\"https://t.me/" + cleanUser + "\">Tap here to chat with Support</a>";

if (isUserAdmin) {
  helpText += "\n\n👑 <i>(Admin: You can change this username in Admin Panel via [ 💬 Set Support ] or /sethelp @username)</i>";
}

var replyKeyboard = (user.telegramid == adminId) ? [
  [
    { text: "📁 My Files", style: "primary" },
    { text: "📤 Upload File", style: "success" },
    { text: "📊 My Traffic", style: "primary" }
  ],
  [
    { text: "🤖 My Bots", style: "primary" },
    { text: "📊 Bot Stats", style: "primary" },
    { text: "ℹ️ Help", style: "primary" }
  ],
  [
    { text: "👑 Admin Panel", style: "primary" },
    { text: "📦 Storage DB", style: "success" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
] : [
  [
    { text: "📁 My Files", style: "primary" },
    { text: "📤 Upload File", style: "success" },
    { text: "📊 My Traffic", style: "primary" }
  ],
  [
    { text: "🤖 My Bots", style: "primary" },
    { text: "ℹ️ Help", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: helpText,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
