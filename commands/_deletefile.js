/*CMD
  command: /deletefile
  help: Delete a file from bot storage by its code
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /delfile
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var fileCode = params;
if (!fileCode) {
  Bot.sendMessage(
    "🗑️ <b>Delete File Command:</b>\n\nUsage: <code>/deletefile &lt;file_code&gt;</code>\nExample: <code>/deletefile FS_AB12CD</code>",
    { parse_mode: "html" }
  );
  return;
}

fileCode = fileCode.trim();
var fileData = Bot.getProperty("file_" + fileCode);

if (!fileData) {
  Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code> does not exist in storage.", { parse_mode: "html" });
  return;
}

// Remove the file property
Bot.setProperty("file_" + fileCode, null, "string");

// Remove code from files_list
var filesList = Bot.getProperty("files_list") || [];
var index = filesList.indexOf(fileCode);
if (index > -1) {
  filesList.splice(index, 1);
  Bot.setProperty("files_list", filesList, "json");
}

// Decrement total files
var totalFiles = Bot.getProperty("total_files") || 0;
if (totalFiles > 0) {
  Bot.setProperty("total_files", totalFiles - 1, "integer");
}

Bot.sendMessage(
  "✅ <b>File Deleted Successfully!</b>\n\n" +
  "• <b>Code:</b> <code>" + fileCode + "</code>\n" +
  "• <b>Name:</b> " + (fileData.name || "Unknown") + "\n\n" +
  "The link is now invalid and users can no longer download it.",
  { parse_mode: "html" }
);
