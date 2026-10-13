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

var buttons = [];

// Show latest files
for (var i = filesList.length - 1; i >= Math.max(0, filesList.length - maxCount); i--) {
  var code = filesList[i];
  var fileData = Bot.getProperty("file_" + code);
  if (fileData) {
    text += "🔹 <b>" + (fileData.name || "File") + "</b>\n" +
      "   • Key: <code>" + code + "</code> | Size: " + fileData.size + "\n" +
      "   • Downloads: <b>" + (fileData.downloads || 0) + "</b>\n" +
      "   • Uploader: <code>" + (fileData.uploaded_by || "Admin") + "</code>\n" +
      "   • Link: <code>https://t.me/" + botUsername + "?start=" + code + "</code>\n\n";

    buttons.push([
      { text: "⚙️ Manage " + code.substring(0, 10), callback_data: "/managefile " + code, style: "primary" },
      { text: "📊 Traffic", callback_data: "/filetraffic " + code, style: "primary" },
      { text: "🗑️ Delete", callback_data: "/deletefile " + code, style: "danger" }
    ]);
  }
}

buttons.push([{ text: "🔙 Back to Admin", callback_data: "/admin", style: "primary" }]);

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
