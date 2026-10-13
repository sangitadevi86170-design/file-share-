/*CMD
  command: /managefile
  help: Manage and edit a stored file
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var fileCode = params ? params.trim() : "";
if (!fileCode) {
  Bot.sendMessage(
    "📁 <b>Manage File Usage:</b>\n\nSend: <code>/managefile &lt;file_code&gt;</code>\nOr open /myfiles to select one.",
    { parse_mode: "html" }
  );
  return;
}

var fileData = Bot.getProperty("file_" + fileCode);
if (!fileData) {
  Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code> does not exist.", { parse_mode: "html" });
  return;
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isOwner = (fileData.uploaded_by == user.telegramid);
var isAdmin = (user.telegramid == adminId);

// Verify permission
if (!isOwner && !isAdmin) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You can only manage files that you uploaded.", { parse_mode: "html" });
  return;
}

var botUsername = Bot.getProperty("bot_username") || "YourBot";
var shareUrl = "https://t.me/" + botUsername + "?start=" + fileCode;

var text = "📁 <b>FILE MANAGER:</b> <code>" + (fileData.name || "Untitled") + "</code>\n\n" +
  "• <b>File Key / Code:</b> <code>" + fileCode + "</code>\n" +
  "• <b>Media Type:</b> " + (fileData.type || "document").toUpperCase() + "\n" +
  "• <b>File Size:</b> " + (fileData.size || "Unknown") + "\n" +
  "• <b>Total Downloads:</b> " + (fileData.downloads || 0) + "\n" +
  "• <b>Uploaded By:</b> <code>" + (fileData.uploaded_by || "User") + "</code>\n" +
  "• <b>Upload Date:</b> " + (fileData.uploaded_at ? fileData.uploaded_at.substring(0, 10) : "N/A") + "\n" +
  "• <b>Current Caption:</b> " + (fileData.caption ? ("<i>" + fileData.caption + "</i>") : "<i>None</i>") + "\n\n" +
  "🔗 <b>Permanent Link:</b>\n<code>" + shareUrl + "</code>\n\n" +
  "⚙️ <b>Actions for this file:</b>\n" +
  "• ✏️ <b>Rename:</b> /renamefile " + fileCode + "\n" +
  "• 📝 <b>Caption:</b> /setcaption " + fileCode + "\n" +
  "• 📊 <b>Traffic:</b> /filetraffic " + fileCode + "\n" +
  "• 🗑️ <b>Delete:</b> /deletefile " + fileCode + "\n\n" +
  "<i>Tap any command above or use the 3x3 menu below:</i>";

var replyKeyboard = (isAdmin) ? [
  [
    { text: "📁 All Files", style: "primary" },
    { text: "📈 All Traffic", style: "primary" },
    { text: "🤖 My Bots", style: "primary" }
  ],
  [
    { text: "📢 Force Channels", style: "primary" },
    { text: "🔐 Button Locker", style: "primary" },
    { text: "🛡️ Protect Content", style: "primary" }
  ],
  [
    { text: "📦 Storage DB", style: "success" },
    { text: "📢 Broadcast", style: "primary" },
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
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
