/*CMD
  command: /broadcast
  help: Broadcast announcement to all bot users
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var textToBroadcast = params;
if (!textToBroadcast) {
  Bot.sendMessage(
    "📢 <b>Broadcast Command Usage:</b>\n\n" +
    "Send: <code>/broadcast Your message goes here</code>\n\n" +
    "Supports HTML formatting like <b>bold</b>, <i>italic</i>, and links.",
    { parse_mode: "html" }
  );
  return;
}

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
