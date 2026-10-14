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
if (!fileCode) {
  var uState = User.getProperty("user_state") || "";
  if (uState.indexOf("waiting_caption_") === 0) {
    fileCode = uState.replace("waiting_caption_", "");
  }
}

var input = "";
if (typeof message === "string") {
  input = message.trim();
} else if (typeof message === "object" && message && message.text) {
  input = message.text.trim();
} else if (typeof request !== "undefined" && request && request.text) {
  input = request.text.trim();
} else if (typeof request !== "undefined" && request && request.message && request.message.text) {
  input = request.message.text.trim();
}

User.setProperty("caption_code", null, "string");
User.setProperty("user_state", null, "string");

if (!input || input === "/cancel" || input.indexOf("Cancel") !== -1 || input.indexOf("My Files") !== -1) {
  Bot.sendMessage("❌ Caption edit cancelled.", { parse_mode: "html" });
  Bot.runCommand("/myfiles");
  return;
}
if (input.indexOf("Main Menu") !== -1) {
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
var isOwner = (String(fileData.uploaded_by) === String(user.telegramid));
var isAdmin = (String(user.telegramid) === "8710308658" || String(user.telegramid) === String(adminId));

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

Bot.sendMessage(
  "✅ <b>Caption Saved Successfully!</b>\n\n" +
  "• <b>Key:</b> <code>" + fileCode + "</code>\n" +
  "• <b>Caption:</b> " + (newCaption ? ("<i>" + newCaption + "</i>") : "<i>None (Cleared)</i>"),
  { parse_mode: "html" }
);

Bot.runCommand("/managefile " + fileCode);
