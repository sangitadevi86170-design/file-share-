/*CMD
  command: /onPublicInput
  help: Save public channel username
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) return;

var input = message ? message.trim() : "";

// Check for cancel / back navigation buttons
if (!input || input === "/cancel" || input.indexOf("Back") !== -1 || input.indexOf("Cancel") !== -1) {
  Bot.sendMessage("❌ Channel addition cancelled.", { parse_mode: "html" });
  Bot.runCommand("/fsubchannels");
  return;
}
if (input.indexOf("Admin") !== -1) {
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Menu") !== -1) {
  Bot.runCommand("/start");
  return;
}

if (input.indexOf("@") !== 0) {
  input = "@" + input;
}

var channelLink = "https://t.me/" + input.replace("@", "");
var channels = Bot.getProperty("fsub_channels") || [];

// Check if already in list
var exists = false;
for (var i = 0; i < channels.length; i++) {
  if (channels[i].id === input) {
    channels[i].link = channelLink;
    channels[i].type = "public";
    channels[i].title = input;
    exists = true;
    break;
  }
}

if (!exists) {
  channels.push({
    id: input,
    link: channelLink,
    title: input,
    type: "public"
  });
}

Bot.setProperty("fsub_channels", channels, "json");
Bot.setProperty("fsub_channel", input, "string");

Bot.sendMessage(
  "✅ <b>Public Channel Added Successfully!</b>\n\n" +
  "• <b>Type:</b> 🌐 PUBLIC\n" +
  "• <b>Username:</b> <code>" + input + "</code>\n" +
  "• <b>Link:</b> " + channelLink,
  { parse_mode: "html" }
);

Bot.runCommand("/fsubchannels");
