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

var maxCount = Math.min(6, userFiles.length);
var text = "📁 <b>MY UPLOADED FILES (Showing " + maxCount + " of " + userFiles.length + "):</b>\n\n";
var buttons = [];

for (var i = 0; i < maxCount; i++) {
  var code = userFiles[i];
  var fileData = Bot.getProperty("file_" + code);
  if (fileData) {
    var shareUrl = "https://t.me/" + botUsername + "?start=" + code;
    text += (i + 1) + ". 🔹 <b>" + (fileData.name || "File") + "</b>\n" +
      "   • Key: <code>" + code + "</code> | Size: " + (fileData.size || "Unknown") + "\n" +
      "   • Downloads: <b>" + (fileData.downloads || 0) + "</b>\n" +
      "   • Link: <code>" + shareUrl + "</code>\n\n";

    buttons.push([
      { text: "⚙️ Manage " + (fileData.name || code).substring(0, 15), callback_data: "/managefile " + code, style: "primary" },
      { text: "📊 Traffic", callback_data: "/filetraffic " + code, style: "primary" },
      { text: "🗑️ Delete", callback_data: "/deletefile " + code, style: "danger" }
    ]);
  }
}

text += "<i>Tap 'Manage' to rename, edit caption, or get share link. Tap 'Traffic' to see who downloaded your file!</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
