/*CMD
  command: /onSaveChannel
  help: Parse and store the new Force Subscribe channel
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  return;
}

var type = User.getProperty("adding_channel_type") || "public";
var input = message ? message.trim() : "";

if (!input) {
  Bot.sendMessage("⚠️ Input cannot be empty. Channel not added.");
  return;
}

var parts = input.split(" ");
var channelId = parts[0];
var channelLink = "";
var channelTitle = "";

if (type === "public") {
  if (channelId.indexOf("@") !== 0) {
    channelId = "@" + channelId;
  }
  channelLink = "https://t.me/" + channelId.replace("@", "");
  channelTitle = parts.length > 1 ? parts.slice(1).join(" ") : channelId;
} else {
  // private or request
  if (parts.length < 2) {
    Bot.sendMessage(
      "❌ <b>Invalid Format!</b>\nPlease provide both Channel ID and Link separated by space.\nExample: <code>-1001234567890 https://t.me/+xyz Title</code>",
      { parse_mode: "html" }
    );
    return;
  }
  channelLink = parts[1];
  channelTitle = parts.length > 2 ? parts.slice(2).join(" ") : (type === "request" ? "Request Channel" : "Private Channel");
}

var channels = Bot.getProperty("fsub_channels") || [];

// Check if already added
var exists = false;
for (var i = 0; i < channels.length; i++) {
  if (channels[i].id === channelId) {
    channels[i].link = channelLink;
    channels[i].title = channelTitle;
    channels[i].type = type;
    exists = true;
    break;
  }
}

if (!exists) {
  channels.push({
    id: channelId,
    link: channelLink,
    title: channelTitle,
    type: type
  });
}

Bot.setProperty("fsub_channels", channels, "json");
// Keep legacy property updated too
Bot.setProperty("fsub_channel", channelId, "string");

User.setProperty("adding_channel_type", null, "string");

Bot.sendMessage(
  "✅ <b>Channel Added Successfully!</b>\n\n" +
  "• <b>Type:</b> " + type.toUpperCase() + "\n" +
  "• <b>Title:</b> " + channelTitle + "\n" +
  "• <b>ID:</b> <code>" + channelId + "</code>\n" +
  "• <b>Link:</b> " + channelLink + "\n\n" +
  "<i>Users will now be required to join/request this channel!</i>",
  { parse_mode: "html" }
);

Bot.runCommand("/fsubchannels");
