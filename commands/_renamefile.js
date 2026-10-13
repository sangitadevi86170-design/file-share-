/*CMD
  command: /renamefile
  help: Rename a stored file
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var input = params ? params.trim() : "";
if (!input) {
  Bot.sendMessage(
    "✏️ <b>Rename File Usage:</b>\n\n" +
    "Send: <code>/renamefile &lt;file_code&gt; &lt;new_name&gt;</code>\n" +
    "Example: <code>/renamefile BQADAQADzB8AAjAeUEZYFkQvPofTKBYE NewMovie.mkv</code>\n\n" +
    "Or click 'Rename' from /myfiles.",
    { parse_mode: "html" }
  );
  return;
}

var parts = input.split(" ");
var fileCode = parts[0];
var fileData = Bot.getProperty("file_" + fileCode);

if (!fileData) {
  Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code>", { parse_mode: "html" });
  return;
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isOwner = (fileData.uploaded_by == user.telegramid);
var isAdmin = (user.telegramid == adminId);

if (!isOwner && !isAdmin) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You can only rename files you uploaded.", { parse_mode: "html" });
  return;
}

// If new name was provided directly in params
if (parts.length > 1) {
  var newName = parts.slice(1).join(" ");
  fileData.name = newName;
  Bot.setProperty("file_" + fileCode, fileData, "json");
  Bot.sendMessage(
    "✅ <b>File Renamed Successfully!</b>\n\n" +
    "• <b>Key:</b> <code>" + fileCode + "</code>\n" +
    "• <b>New Name:</b> <code>" + newName + "</code>",
    { parse_mode: "html" }
  );
  Bot.runCommand("/managefile " + fileCode);
  return;
}

// Prompt for new name interactively
User.setProperty("renaming_code", fileCode, "string");

var navKeyboard = [
  [
    { text: "📁 My Files", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "✏️ <b>Renaming File:</b> <code>" + (fileData.name || fileCode) + "</code>\n\n" +
    "Please send the <b>New File Name</b> now (e.g. <code>Updated_Document.pdf</code>):\n\n" +
    "<i>Or tap [ 📁 My Files ] to cancel.</i>",
  parse_mode: "html",
  reply_markup: {
    keyboard: navKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});

Bot.run({ command: "/onRenameSave" });
