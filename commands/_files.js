/*CMD
  command: /files
  help: View list of recent stored files with management controls
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 📁 All Files, All Files
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b> Use <b>📁 My Files</b> to view your own files.", { parse_mode: "html" });
  return;
}

var filesList = Bot.getProperty("files_list") || [];
if (filesList.length === 0) {
  Bot.sendMessage("📁 <b>No files stored yet.</b> Upload a file to generate a link!", { parse_mode: "html" });
  return;
}

var botUsername = Bot.getProperty("bot_username") || "YourBot";
var maxCount = Math.min(8, filesList.length);
var text = "📁 <b>ALL STORED FILES (Showing " + maxCount + " of " + filesList.length + "):</b>\n\n";

// Show latest files
for (var i = filesList.length - 1; i >= Math.max(0, filesList.length - maxCount); i--) {
  var code = filesList[i];
  var fileData = Bot.getProperty("file_" + code);
  if (fileData) {
    text += "🔹 <b>" + (fileData.name || "File") + "</b>\n" +
      "   • <b>Size:</b> " + fileData.size + " | <b>Downloads:</b> " + (fileData.downloads || 0) + " | <b>By:</b> <code>" + (fileData.uploaded_by || "Admin") + "</code>\n" +
      "   • <b>Link:</b> <code>https://t.me/" + botUsername + "?start=" + code + "</code>\n" +
      "   • ⚙️ /manage_" + code + "  📊 /traffic_" + code + "  🗑️ /del_" + code + "\n\n";
  }
}

text += "<i>💡 Tap any command link above to manage.</i>";

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
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: adminReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
