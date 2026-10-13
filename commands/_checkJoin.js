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

// User has not joined: Display lock screen with channel links and Reply Keyboard
User.setProperty("fsub_checking_index", 0, "integer");

var text = "🔒 <b>Access Denied: Channel Membership Required!</b>\n\n" +
  "You must join our channel to access and download this file:\n\n";

for (var i = 0; i < channels.length; i++) {
  var ch = channels[i];
  var label = (channels.length > 1) ? ("Channel " + (i + 1)) : "Join Channel";
  text += (i + 1) + ". 👉 <a href=\"" + ch.link + "\"><b>" + label + " (" + (ch.title || "Join") + ")</b></a>\n" +
    "   🔗 <code>" + ch.link + "</code>\n\n";
}

text += "<i>1️⃣ Click the channel link above\n" +
  "2️⃣ Join or Send Join Request\n" +
  "3️⃣ Tap <b>🔄 Try Again</b> on the keyboard below:</i>";

var joinReplyKeyboard = [
  [
    { text: "🔄 Try Again", style: "success" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: joinReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
