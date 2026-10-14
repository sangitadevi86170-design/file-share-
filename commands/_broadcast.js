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

var isUserAdmin = (String(user.telegramid) === "8710308658" || String(user.telegramid) === String(Bot.getProperty("admin_id")));
if (!isUserAdmin) {
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
      "• Supports <b>bold</b>, <i>italic</i>, and <a href=\"https://t.me\">links</a>.\n" +
      "• You can also send or forward a <b>Photo, Video, or Document</b> with a caption!\n\n" +
      "<i>👇 Send your message now, or tap [ 👑 Admin Panel ] to cancel:</i>",
    parse_mode: "html",
    reply_markup: {
      keyboard: navKeyboard,
      resize_keyboard: true,
      is_persistent: true
    }
  });

  User.setProperty("admin_state", "waiting_broadcast_message", "string");
  Bot.run({ command: "/onBroadcastInput" });
  return;
}

// If explicit param was given (e.g. /broadcast Hello everyone)
var userList = Bot.getProperty("user_list") || [];
if (userList.length === 0) {
  Bot.sendMessage("⚠️ <b>No registered users found to broadcast to.</b>", { parse_mode: "html" });
  return;
}

var bannedUsers = Bot.getProperty("banned_users") || [];
var validTargets = [];
var bannedCount = 0;
var invalidCount = 0;

for (var i = 0; i < userList.length; i++) {
  var targetId = userList[i];
  if (!targetId) {
    invalidCount++;
    continue;
  }
  var isBanned = (bannedUsers.indexOf(targetId) !== -1 || 
                  bannedUsers.indexOf(String(targetId)) !== -1 || 
                  bannedUsers.indexOf(parseInt(targetId)) !== -1);
  if (isBanned) {
    bannedCount++;
    continue;
  }
  validTargets.push(targetId);
}

var sentCount = 0;
var apiErrorCount = 0;

for (var j = 0; j < validTargets.length; j++) {
  try {
    Api.sendMessage({
      chat_id: validTargets[j],
      text: "📢 <b>Announcement:</b>\n\n" + textToBroadcast,
      parse_mode: "html",
      on_error: "/onBroadcastError"
    });
    sentCount++;
  } catch (err) {
    apiErrorCount++;
  }
}

var totalFailed = apiErrorCount + bannedCount + invalidCount;
var successRate = userList.length > 0 ? ((sentCount / userList.length) * 100).toFixed(1) : "100.0";

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

var reportMsg = "📢 <b>BROADCAST DISPATCH REPORT</b>\n\n" +
  "━━━━━━━━━━━━━━━━━━━━\n" +
  "👥 <b>Total Users in Database:</b> <code>" + userList.length + "</code>\n" +
  "🎯 <b>Targeted Active Users:</b> <code>" + validTargets.length + "</code>\n\n" +
  "✅ <b>Successfully Dispatched:</b> <code>" + sentCount + "</code>\n" +
  "❌ <b>Failed / Excluded:</b> <code>" + totalFailed + "</code>\n";

if (bannedCount > 0) {
  reportMsg += "   • 🚫 <i>Banned Users Skipped: " + bannedCount + "</i>\n";
}
if (invalidCount > 0) {
  reportMsg += "   • ⚠️ <i>Invalid User IDs: " + invalidCount + "</i>\n";
}
if (apiErrorCount > 0) {
  reportMsg += "   • 🛑 <i>API Delivery Errors: " + apiErrorCount + "</i>\n";
}
if (totalFailed === 0) {
  reportMsg += "   • 🎉 <i>100% Success — 0 Failed!</i>\n";
}

reportMsg += "━━━━━━━━━━━━━━━━━━━━\n" +
  "📊 <b>Delivery Rate:</b> <code>" + successRate + "%</code>\n" +
  "⏱️ <b>Status:</b> Completed Successfully ✅";

Api.sendMessage({
  chat_id: chat.chatid,
  text: reportMsg,
  parse_mode: "html",
  reply_markup: {
    keyboard: adminReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
