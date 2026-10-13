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

var fileCode = params ? params.trim() : "";
if (!fileCode) {
  Bot.sendMessage(
    "🗑️ <b>Delete File Usage:</b>\n\nUsage: <code>/deletefile &lt;file_code&gt;</code>\nExample: <code>/deletefile BQADAQADzB8AAjAeUEZYFkQvPofTKBYE</code>",
    { parse_mode: "html" }
  );
  return;
}

var fileData = Bot.getProperty("file_" + fileCode);
if (!fileData) {
  Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code> does not exist in storage.", { parse_mode: "html" });
  return;
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isOwner = (fileData.uploaded_by == user.telegramid);
var isAdmin = (user.telegramid == adminId);

if (!isOwner && !isAdmin) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You can only delete files that you uploaded.", { parse_mode: "html" });
  return;
}

// Remove the file property
Bot.setProperty("file_" + fileCode, null, "string");

// Remove code from global files_list
var filesList = Bot.getProperty("files_list") || [];
var index = filesList.indexOf(fileCode);
if (index > -1) {
  filesList.splice(index, 1);
  Bot.setProperty("files_list", filesList, "json");
}

// Remove code from user's user_files
var userFiles = User.getProperty("user_files") || [];
var uIndex = userFiles.indexOf(fileCode);
if (uIndex > -1) {
  userFiles.splice(uIndex, 1);
  User.setProperty("user_files", userFiles, "json");
}

// Decrement total files
var totalFiles = Bot.getProperty("total_files") || 0;
if (totalFiles > 0) {
  Bot.setProperty("total_files", totalFiles - 1, "integer");
}

Bot.sendMessage(
  "✅ <b>File Deleted Successfully!</b>\n\n" +
  "• <b>Key:</b> <code>" + fileCode + "</code>\n" +
  "• <b>Name:</b> " + (fileData.name || "Unknown") + "\n\n" +
  "The link is now invalid and users can no longer download it.",
  { parse_mode: "html" }
);
