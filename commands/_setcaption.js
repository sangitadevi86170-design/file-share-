/*CMD
  command: /setcaption
  help: Set or edit caption for a stored file
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
    "📝 <b>Set Caption Usage:</b>\n\n" +
    "Send: <code>/setcaption &lt;file_code&gt; &lt;caption_text&gt;</code>\n" +
    "Or click 'Edit Caption' from /managefile.",
    { parse_mode: "html" }
  );
  return;
}

var parts = input.split(" ");
var fileCode = parts[0];

if (parts.length > 1) {
  var newCaption = parts.slice(1).join(" ");
  var fileData = Bot.getProperty("file_" + fileCode);
  if (!fileData) {
    Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code>", { parse_mode: "html" });
    return;
  }
  fileData.caption = newCaption;
  Bot.setProperty("file_" + fileCode, fileData, "json");
  Bot.sendMessage(
    "✅ <b>Caption Updated Successfully!</b>\n\n" +
    "• <b>Code:</b> <code>" + fileCode + "</code>\n" +
    "• <b>Caption:</b> " + newCaption,
    { parse_mode: "html" }
  );
  Bot.runCommand("/managefile " + fileCode);
  return;
}

var fileData = Bot.getProperty("file_" + fileCode);
if (!fileData) {
  Bot.sendMessage("⚠️ <b>File not found:</b> <code>" + fileCode + "</code>", { parse_mode: "html" });
  return;
}

User.setProperty("caption_code", fileCode, "string");
Bot.sendMessage(
  "📝 <b>Editing Caption For:</b> <code>" + (fileData.name || fileCode) + "</code>\n\n" +
  "Current Caption: <i>" + (fileData.caption || "None") + "</i>\n\n" +
  "Please send the <b>New Caption</b> now (or send <code>clear</code> to remove caption):",
  { parse_mode: "html" }
);
Bot.runCommand("/onCaptionSave");
