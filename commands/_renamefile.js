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

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var input = params ? params.trim() : "";
if (!input) {
  Bot.sendMessage(
    "✏️ <b>Rename File Usage:</b>\n\n" +
    "Send: <code>/renamefile &lt;file_code&gt; &lt;new_name&gt;</code>\n" +
    "Example: <code>/renamefile FS_9X8K2 NewMovie2026.mkv</code>\n\n" +
    "Or click 'Rename File' from /managefile.",
    { parse_mode: "html" }
  );
  return;
}

var parts = input.split(" ");
var fileCode = parts[0];

// If new name was provided directly in params
if (parts.length > 1) {
  var newName = parts.slice(1).join(" ");
  var fileData = Bot.getProperty("file_" + fileCode);
  if (!fileData) {
    Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code>", { parse_mode: "html" });
    return;
  }
  fileData.name = newName;
  Bot.setProperty("file_" + fileCode, fileData, "json");
  Bot.sendMessage(
    "✅ <b>File Renamed Successfully!</b>\n\n" +
    "• <b>Code:</b> <code>" + fileCode + "</code>\n" +
    "• <b>New Name:</b> <code>" + newName + "</code>",
    { parse_mode: "html" }
  );
  Bot.runCommand("/managefile " + fileCode);
  return;
}

// If only file code was provided, prompt for new name
var fileData = Bot.getProperty("file_" + fileCode);
if (!fileData) {
  Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code>", { parse_mode: "html" });
  return;
}

User.setProperty("renaming_code", fileCode, "string");
Bot.sendMessage(
  "✏️ <b>Renaming File:</b> <code>" + (fileData.name || fileCode) + "</code>\n\n" +
  "Please send the <b>New File Name</b> now (e.g. <code>Document_Updated.pdf</code>):",
  { parse_mode: "html" }
);
Bot.runCommand("/onRenameSave");
