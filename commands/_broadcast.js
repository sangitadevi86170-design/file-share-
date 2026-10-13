/*CMD
  command: /broadcast
  help: Broadcast announcement to all bot users
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 📢 Broadcast, Broadcast
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var textToBroadcast = params ? params.trim() : "";

// If triggered from button or empty, ask for broadcast content
if (!textToBroadcast || textToBroadcast === "Broadcast" || textToBroadcast === "📢 Broadcast") {
  var navKeyboard = [
    [
      { text: "👑 Admin Panel", style: "primary" },
      { text: "🔙 Main Menu", style: "danger" }
    ]
  ];

  Api.sendMessage({
    chat_id: chat.chatid,
    text: "📢 <b>BROADCAST ANNOUNCEMENT</b>\n\n" +
      "Please send the message you want to broadcast to all registered bot users:\n\n" +
      "• Supports <b>bold</b>, <i>italic</i>, and <a href=\"https://t.me\">links</a>.\n\n" +
      "<i>👇 Send your message now, or tap [ 👑 Admin Panel ] to cancel:</i>",
    parse_mode: "html",
    reply_markup: {
      keyboard: navKeyboard,
      resize_keyboard: true,
      is_persistent: true
    }
  });

  Bot.run({ command: "/onBroadcastInput" });
  return;
}

// If explicit param was given (e.g. /broadcast Hello everyone)
var userList = Bot.getProperty("user_list") || [];
if (userList.length === 0) {
  Bot.sendMessage("⚠️ No registered users found to broadcast to.");
  return;
}

var sentCount = 0;
var failedCount = 0;

for (var i = 0; i < userList.length; i++) {
  var targetId = userList[i];
  try {
    Api.sendMessage({
      chat_id: targetId,
      text: "📢 <b>Announcement:</b>\n\n" + textToBroadcast,
      parse_mode: "html"
    });
    sentCount++;
  } catch (err) {
    failedCount++;
  }
}

Bot.sendMessage(
  "✅ <b>Broadcast Completed!</b>\n\n" +
  "• <b>Total Users Targeted:</b> " + userList.length + "\n" +
  "• <b>Messages Dispatched:</b> " + sentCount + "\n" +
  (failedCount > 0 ? ("• <b>Failed/Blocked:</b> " + failedCount + "\n") : ""),
  { parse_mode: "html" }
);
