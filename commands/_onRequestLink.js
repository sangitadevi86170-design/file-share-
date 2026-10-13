/*CMD
  command: /onRequestLink
  help: Save private request channel link (Step 2/2) and finalize channel addition
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) return;

var link = message ? message.trim() : "";
if (!link) {
  Bot.sendMessage("⚠️ Link cannot be empty.");
  return;
}

var chatId = User.getProperty("temp_request_id");
if (!chatId) {
  Bot.sendMessage("⚠️ Setup session expired. Please start again from /addchannel.");
  return;
}

var channels = Bot.getProperty("fsub_channels") || [];

var exists = false;
for (var i = 0; i < channels.length; i++) {
  if (channels[i].id === chatId) {
    channels[i].link = link;
    channels[i].type = "request";
    channels[i].title = "Private Request Channel (" + chatId + ")";
    exists = true;
    break;
  }
}

if (!exists) {
  channels.push({
    id: chatId,
    link: link,
    title: "Private Request Channel (" + chatId + ")",
    type: "request"
  });
}

Bot.setProperty("fsub_channels", channels, "json");
Bot.setProperty("fsub_channel", chatId, "string");
User.setProperty("temp_request_id", null, "string");

Bot.sendMessage(
  "✅ <b>Private Request Channel Added Successfully!</b>\n\n" +
  "• <b>Type:</b> 📝 PRIVATE REQUEST (Approval Mode)\n" +
  "• <b>Chat ID:</b> <code>" + chatId + "</code>\n" +
  "• <b>Request Link:</b> " + link + "\n\n" +
  "💡 <i>Users with pending join requests will automatically be approved to download files!</i>",
  { parse_mode: "html" }
);

Bot.runCommand("/fsubchannels");
