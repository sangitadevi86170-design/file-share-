/*CMD
  command: /checkJoin
  help: Callback for channel membership check (Force Subscribe)
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var member = options && options.result;
var fsubChannel = Bot.getProperty("fsub_channel");
var requestedFile = User.getProperty("requested_file");

if (member) {
  var status = member.status;
  // Valid member statuses
  if (status == "member" || status == "administrator" || status == "creator") {
    Bot.sendMessage("✅ <b>Channel Membership Verified!</b> Fetching your file now...", { parse_mode: "html" });
    if (requestedFile) {
      Bot.runCommand("/getFile " + requestedFile);
    }
    return;
  }
}

// User is NOT a member: Show Force Join prompt
var channelUrl = "";
if (fsubChannel) {
  if (fsubChannel.indexOf("@") === 0) {
    channelUrl = "https://t.me/" + fsubChannel.replace("@", "");
  } else {
    channelUrl = "https://t.me/" + fsubChannel;
  }
}

var text = "🔒 <b>Access Denied: Channel Membership Required!</b>\n\n" +
  "You must join our official updates channel before accessing this file.\n\n" +
  "<b>Steps to unlock:</b>\n" +
  "1️⃣ Click <b>📢 Join Channel</b> below\n" +
  "2️⃣ Join the channel\n" +
  "3️⃣ Return here and click <b>🔄 Try Again</b>";

var buttons = [
  [{ text: "📢 Join Channel", url: channelUrl }],
  [{ text: "🔄 Try Again", callback_data: "/verifyJoin" }]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
