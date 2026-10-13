/*CMD
  command: /about
  help: Information about the bot
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 🤖 About Bot, About Bot
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
var locked = Bot.getProperty("locked_buttons") || {};

if (locked.about && user.telegramid != adminId) {
  Bot.sendMessage("🔒 <b>Feature Locked:</b> About info is currently locked by the administrator.", { parse_mode: "html" });
  return;
}

var aboutText = "🤖 <b>ABOUT FILE SHARE BOT (.BB)</b>\n\n" +
  "• <b>Bot Type:</b> Advanced Telegram File Store & Sharing Bot\n" +
  "• <b>Engine:</b> Bots.Business BJS (Bot Java Script)\n" +
  "• <b>Hosting:</b> Cloud Hosted on Bots.Business (.bb)\n" +
  "• <b>Storage:</b> Telegram Bot API Cloud Storage (Permanent)\n" +
  "• <b>Security:</b> Multi-Channel Lock (Public, Private, Request Channels)\n" +
  "• <b>Analytics:</b> Live User Download & Traffic Tracker\n" +
  "• <b>Controls:</b> File Manager (Rename, Captions) & Button Locker\n\n" +
  "✨ <i>Fast, 24/7 online, zero hosting costs!</i>";

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
    { text: "📊 Bot Stats", style: "primary" },
    { text: "ℹ️ Help", style: "primary" }
  ],
  [
    { text: "🤖 About Bot", style: "primary" },
    { text: "🔄 Refresh", style: "success" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: aboutText,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
