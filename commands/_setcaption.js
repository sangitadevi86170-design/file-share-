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

var input = params ? params.trim() : "";
if (!input) {
  Bot.sendMessage(
    "📝 <b>Set Caption Usage:</b>\n\n" +
    "Send: <code>/setcaption &lt;file_code&gt; &lt;caption_text&gt;</code>\n" +
    "Or click 'Edit Caption' from /myfiles.",
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
  Bot.sendMessage("⛔ <b>Access Denied:</b> You can only edit caption for files you uploaded.", { parse_mode: "html" });
  return;
}

if (parts.length > 1) {
  var newCaption = parts.slice(1).join(" ");
  if (newCaption.toLowerCase() === "clear" || newCaption.toLowerCase() === "none") {
    newCaption = "";
  }
  fileData.caption = newCaption;
  Bot.setProperty("file_" + fileCode, fileData, "json");
  Bot.sendMessage(
    "✅ <b>Caption Updated Successfully!</b>\n\n" +
    "• <b>Key:</b> <code>" + fileCode + "</code>\n" +
    "• <b>Caption:</b> " + (newCaption ? ("<i>" + newCaption + "</i>") : "<i>None (Cleared)</i>"),
    { parse_mode: "html" }
  );
  Bot.runCommand("/managefile " + fileCode);
  return;
}

User.setProperty("caption_code", fileCode, "string");

var navKeyboard = [
  [
    { text: "📁 My Files", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "📝 <b>Editing Caption For:</b> <code>" + (fileData.name || fileCode) + "</code>\n\n" +
    "Current Caption: <i>" + (fileData.caption || "None") + "</i>\n\n" +
    "Please send the <b>New Caption</b> now (or send <code>clear</code> to remove caption):\n\n" +
    "<i>Or tap [ 📁 My Files ] to cancel.</i>",
  parse_mode: "html",
  reply_markup: {
    keyboard: navKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});

Bot.run({ command: "/onCaptionSave" });
