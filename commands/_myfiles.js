/*CMD
  command: /myfiles
  help: View and manage all files uploaded by you
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 📁 My Files, My Files
  group: 
CMD*/

var bannedUsers = Bot.getProperty("banned_users") || [];
if (bannedUsers.indexOf(user.telegramid) !== -1) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You are banned from using this bot.", { parse_mode: "html" });
  return;
}

var userFiles = User.getProperty("user_files") || [];
var botUsername = Bot.getProperty("bot_username") || "YourBot";

if (userFiles.length === 0) {
  Bot.sendMessage(
    "📁 <b>MY UPLOADED FILES</b>\n\n" +
    "You haven't uploaded any files yet.\n\n" +
    "💡 <i>To upload a file, simply send or forward any document, video, photo, or audio directly to this chat!</i>",
    { parse_mode: "html" }
  );
  return;
}

var maxCount = Math.min(8, userFiles.length);
var text = "📁 <b>MY UPLOADED FILES (Showing " + maxCount + " of " + userFiles.length + "):</b>\n\n";

for (var i = 0; i < maxCount; i++) {
  var code = userFiles[i];
  var fileData = Bot.getProperty("file_" + code);
  if (fileData) {
    var shareUrl = "https://t.me/" + botUsername + "?start=" + code;
    text += (i + 1) + ". 🔹 <b>" + (fileData.name || "File") + "</b>\n" +
      "   • <b>Size:</b> " + (fileData.size || "Unknown") + " | <b>Downloads:</b> " + (fileData.downloads || 0) + "\n" +
      "   • <b>Link:</b> <code>" + shareUrl + "</code>\n" +
      "   • ⚙️ /manage_" + code + "  📊 /traffic_" + code + "  🗑️ /del_" + code + "\n\n";
  }
}

text += "<i>💡 Tap /manage_&lt;code&gt; above to rename or edit caption.</i>";

var adminId = Bot.getProperty("admin_id") || "8710308658";
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
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
