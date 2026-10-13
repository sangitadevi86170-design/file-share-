/*CMD
  command: /onPublicInput
  help: Save public channel username
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

var input = message ? message.trim() : "";
if (!input) {
  Bot.sendMessage("⚠️ Username cannot be empty.");
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
