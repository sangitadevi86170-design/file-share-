/*CMD
  command: /checkJoin
  help: Callback for channel membership check (supports Public, Private, and Request channels)
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var member = options && options.result;
var channels = Bot.getProperty("fsub_channels") || [];
var requestedFile = User.getProperty("requested_file");

// Also check legacy single channel
if (channels.length === 0) {
  var singleCh = Bot.getProperty("fsub_channel");
  if (singleCh) {
    channels = [{ id: singleCh, link: (singleCh.indexOf("@") === 0 ? ("https://t.me/" + singleCh.replace("@", "")) : ("https://t.me/" + singleCh)), type: "public", title: singleCh }];
  }
}

var currentIndex = User.getProperty("fsub_checking_index") || 0;
var isMember = false;

if (member) {
  var status = member.status;
  if (status == "member" || status == "administrator" || status == "creator") {
    isMember = true;
  }
}

// For request channels, check if user submitted join request
if (!isMember && currentIndex < channels.length) {
  var activeCh = channels[currentIndex];
  if (activeCh && activeCh.type === "request") {
    if (User.getProperty("has_requested_" + activeCh.id)) {
      isMember = true;
    }
  }
}

if (isMember) {
  // Move to next channel check if multiple channels exist
  var nextIndex = currentIndex + 1;
  if (nextIndex < channels.length) {
    User.setProperty("fsub_checking_index", nextIndex, "integer");
    var nextCh = channels[nextIndex];
    Api.getChatMember({
      chat_id: nextCh.id,
      user_id: user.telegramid,
      on_result: "/checkJoin"
    });
    return;
  }

  // All channels verified!
  User.setProperty("fsub_checking_index", 0, "integer");
  Bot.sendMessage("✅ <b>All Channels Verified!</b> Fetching your file now...", { parse_mode: "html" });
  if (requestedFile) {
    Bot.runCommand("/getFile " + requestedFile);
  }
  return;
}

// Failed verification: Show list of all required channels with badges
User.setProperty("fsub_checking_index", 0, "integer");

var text = "🔒 <b>Access Denied: Channel Membership Required!</b>\n\n" +
  "You must join/request our official channels before accessing this file:\n\n";

var buttons = [];
var hasRequestChannel = false;

for (var i = 0; i < channels.length; i++) {
  var ch = channels[i];
  var label = "";
  if (ch.type === "request") {
    hasRequestChannel = true;
    label = "📝 Request to Join: " + (ch.title || ("Channel " + (i + 1)));
  } else if (ch.type === "private") {
    label = "🔒 Join Private: " + (ch.title || ("Channel " + (i + 1)));
  } else {
    label = "🌐 Join: " + (ch.title || ("Channel " + (i + 1)));
  }

  buttons.push([{ text: label, url: ch.link, style: "primary" }]);
}

if (hasRequestChannel) {
  buttons.push([{ text: "✅ I Have Sent Join Request", callback_data: "/sentRequest", style: "success" }]);
}

buttons.push([{ text: "🔄 Verify All & Unlock File", callback_data: "/verifyJoin", style: "success" }]);

text += "👇 <i>Join all required channels above, then click <b>Verify All & Unlock</b>!</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
