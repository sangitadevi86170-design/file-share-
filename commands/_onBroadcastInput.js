/*CMD
  command: /onBroadcastInput
  help: Process and send the broadcast message to all users
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var isUserAdmin = (String(user.telegramid) === "8710308658" || String(user.telegramid) === String(Bot.getProperty("admin_id")));
if (!isUserAdmin) return;

var input = "";
if (typeof message === "string") {
  input = message.trim();
} else if (typeof message === "object" && message && message.text) {
  input = message.text.trim();
} else if (typeof request !== "undefined" && request && request.text) {
  input = request.text.trim();
} else if (typeof request !== "undefined" && request && request.message && request.message.text) {
  input = request.message.text.trim();
}

User.setProperty("admin_state", null, "string");

if (!input || input === "/cancel" || input.indexOf("Cancel") !== -1) {
  Bot.sendMessage("❌ Broadcast cancelled.", { parse_mode: "html" });
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Admin Panel") !== -1) {
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Main Menu") !== -1) {
  Bot.runCommand("/start");
  return;
}

var userList = Bot.getProperty("user_list") || [];
if (userList.length === 0) {
  Bot.sendMessage("⚠️ No registered users found to broadcast to.");
  Bot.runCommand("/admin");
  return;
}

var sentCount = 0;
var failedCount = 0;

for (var i = 0; i < userList.length; i++) {
  var targetId = userList[i];
  try {
    Api.sendMessage({
      chat_id: targetId,
      text: "📢 <b>Announcement:</b>\n\n" + input,
      parse_mode: "html"
    });
    sentCount++;
  } catch (err) {
    failedCount++;
  }
}

var adminReplyKeyboard = [
  [
    { text: "📁 All Files", style: "primary" },
    { text: "📈 All Traffic", style: "primary" },
    { text: "📢 Force Channels", style: "primary" }
  ],
  [
    { text: "🔐 Button Locker", style: "primary" },
    { text: "🛡️ Protect Content", style: "primary" },
    { text: "📦 Storage DB", style: "success" }
  ],
  [
    { text: "💬 Set Support", style: "primary" },
    { text: "📢 Broadcast", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "✅ <b>Broadcast Completed!</b>\n\n" +
    "• <b>Total Users Targeted:</b> " + userList.length + "\n" +
    "• <b>Messages Dispatched:</b> " + sentCount + "\n" +
    (failedCount > 0 ? ("• <b>Failed/Blocked:</b> " + failedCount + "\n") : ""),
  parse_mode: "html",
  reply_markup: {
    keyboard: adminReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
