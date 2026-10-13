/*CMD
  command: /checkJoin
  help: Callback for channel membership check with 'Join' button and request channel auto-approval
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

// Check legacy single channel if array is empty
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

// 💡 PRIVATE REQUEST CHANNEL: User request pending me hai toh bhi approve mana jayega!
if (!isMember && currentIndex < channels.length) {
  var activeCh = channels[currentIndex];
  if (activeCh && activeCh.type === "request") {
    // Approved! User has pending join request or interacted with request link
    isMember = true;
  }
}

if (isMember) {
  // Check next channel in chain if multi-channel
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

  // All channels verified & approved! Deliver file
  User.setProperty("fsub_checking_index", 0, "integer");
  Bot.sendMessage("✅ <b>Channel Verified!</b> Fetching your file now...", { parse_mode: "html" });
  if (requestedFile) {
    Bot.runCommand("/getFile " + requestedFile);
  }
  return;
}

// User has not joined: Display lock screen with clickable button 'Join'
User.setProperty("fsub_checking_index", 0, "integer");

var text = "🔒 <b>Access Denied: Channel Membership Required!</b>\n\n" +
  "You must join our channel to access this file.\n\n" +
  "1️⃣ Click <b>Join</b> below\n" +
  "2️⃣ Join or Send Request\n" +
  "3️⃣ Return here and click <b>🔄 Try Again</b>";

var buttons = [];

for (var i = 0; i < channels.length; i++) {
  var ch = channels[i];
  var btnText = (channels.length > 1) ? ("Join " + (i + 1)) : "Join";
  buttons.push([{ text: btnText, url: ch.link, style: "primary" }]);
}

buttons.push([{ text: "🔄 Try Again", callback_data: "/verifyJoin", style: "success" }]);

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
