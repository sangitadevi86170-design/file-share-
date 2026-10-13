/*CMD
  command: /onRenameSave
  help: Save the new file name received from user
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var fileCode = User.getProperty("renaming_code");
if (!fileCode) {
  Bot.sendMessage("⚠️ No active file being renamed.");
  return;
}

var fileData = Bot.getProperty("file_" + fileCode);
if (!fileData) {
  Bot.sendMessage("⚠️ File no longer exists.");
  return;
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isOwner = (fileData.uploaded_by == user.telegramid);
var isAdmin = (user.telegramid == adminId);

if (!isOwner && !isAdmin) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You can only rename files you uploaded.", { parse_mode: "html" });
  return;
}

var newName = message ? message.trim() : "";
if (!newName) {
  Bot.sendMessage("⚠️ Name cannot be empty.");
  return;
}

fileData.name = newName;
Bot.setProperty("file_" + fileCode, fileData, "json");
User.setProperty("renaming_code", null, "string");

Bot.sendMessage(
  "✅ <b>File Renamed Successfully!</b>\n\n" +
  "• <b>Key:</b> <code>" + fileCode + "</code>\n" +
  "• <b>New Name:</b> <code>" + newName + "</code>",
  { parse_mode: "html" }
);

Bot.runCommand("/managefile " + fileCode);
