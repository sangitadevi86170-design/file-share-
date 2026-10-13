/*CMD
  command: /onCaptionSave
  help: Save the new file caption received from user
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var fileCode = User.getProperty("caption_code");
var input = (message || "").trim();

// Check for cancel / navigation buttons
if (!input || input === "/cancel" || input.indexOf("Cancel") !== -1 || input.indexOf("My Files") !== -1) {
  User.setProperty("caption_code", null, "string");
  Bot.sendMessage("❌ Caption edit cancelled.", { parse_mode: "html" });
  Bot.runCommand("/myfiles");
  return;
}
if (input.indexOf("Menu") !== -1) {
  User.setProperty("caption_code", null, "string");
  Bot.runCommand("/start");
  return;
}

if (!fileCode) {
  Bot.sendMessage("⚠️ No active file caption being edited.");
  Bot.runCommand("/myfiles");
  return;
}

var fileData = Bot.getProperty("file_" + fileCode);
if (!fileData) {
  Bot.sendMessage("⚠️ File no longer exists.");
  Bot.runCommand("/myfiles");
  return;
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isOwner = (fileData.uploaded_by == user.telegramid);
var isAdmin = (user.telegramid == adminId);

if (!isOwner && !isAdmin) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You can only edit caption for files you uploaded.", { parse_mode: "html" });
  return;
}

var newCaption = input;
if (newCaption.toLowerCase() === "clear" || newCaption.toLowerCase() === "none") {
  newCaption = "";
}

fileData.caption = newCaption;
Bot.setProperty("file_" + fileCode, fileData, "json");
User.setProperty("caption_code", null, "string");

Bot.sendMessage(
  "✅ <b>Caption Saved Successfully!</b>\n\n" +
  "• <b>Key:</b> <code>" + fileCode + "</code>\n" +
  "• <b>Caption:</b> " + (newCaption ? ("<i>" + newCaption + "</i>") : "<i>None (Cleared)</i>"),
  { parse_mode: "html" }
);

Bot.runCommand("/managefile " + fileCode);
