/*CMD
  command: /files
  help: View list of recent stored files
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var filesList = Bot.getProperty("files_list") || [];
if (filesList.length === 0) {
  Bot.sendMessage("📁 <b>No files stored yet.</b> Upload a file to generate a link!", { parse_mode: "html" });
  return;
}

var botUsername = Bot.getProperty("bot_username") || "YourBot";
var maxCount = Math.min(10, filesList.length);
var text = "📁 <b>RECENT STORED FILES (Latest " + maxCount + " of " + filesList.length + "):</b>\n\n";

// Show latest files (iterate from end of list)
for (var i = filesList.length - 1; i >= Math.max(0, filesList.length - maxCount); i--) {
  var code = filesList[i];
  var fileData = Bot.getProperty("file_" + code);
  if (fileData) {
    text += "🔹 <b>" + (fileData.name || "File") + "</b>\n" +
      "   • Code: <code>" + code + "</code> | Size: " + fileData.size + "\n" +
      "   • Downloads: " + (fileData.downloads || 0) + "\n" +
      "   • Link: <code>https://t.me/" + botUsername + "?start=" + code + "</code>\n\n";
  }
}

text += "<i>To delete a file, use: /deletefile &lt;code&gt;</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html"
});
