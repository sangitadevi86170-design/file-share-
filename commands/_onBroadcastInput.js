/*CMD
  command: /onBroadcastInput
  help: Process and send the broadcast message to all users with detailed success and failure metrics
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

// Check for cancel / navigation buttons
if (input === "/cancel" || input.indexOf("Cancel") !== -1) {
  User.setProperty("admin_state", null, "string");
  Bot.sendMessage("❌ Broadcast cancelled.", { parse_mode: "html" });
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Admin Panel") !== -1) {
  User.setProperty("admin_state", null, "string");
  Bot.runCommand("/admin");
  return;
}
if (input.indexOf("Main Menu") !== -1) {
  User.setProperty("admin_state", null, "string");
  Bot.runCommand("/start");
  return;
}

// Media detection
var doc = (typeof request !== "undefined" && request && request.document) || 
          (typeof request !== "undefined" && request && request.message && request.message.document) || 
          (typeof message === "object" && message && message.document);

var video = (typeof request !== "undefined" && request && request.video) || 
            (typeof request !== "undefined" && request && request.message && request.message.video) || 
            (typeof message === "object" && message && message.video);

var photo = (typeof request !== "undefined" && request && request.photo) || 
            (typeof request !== "undefined" && request && request.message && request.message.photo) || 
            (typeof message === "object" && message && message.photo);

var audio = (typeof request !== "undefined" && request && request.audio) || 
            (typeof request !== "undefined" && request && request.message && request.message.audio) || 
            (typeof message === "object" && message && message.audio);

var caption = (typeof request !== "undefined" && request && request.caption) || 
              (typeof request !== "undefined" && request && request.message && request.message.caption) || 
              "";

var hasMedia = (doc || video || photo || audio);

if (!input && !hasMedia) {
  Bot.sendMessage("⚠️ <b>Empty content:</b> Please send text or media to broadcast, or tap [ 👑 Admin Panel ] to cancel.", { parse_mode: "html" });
  Bot.run({ command: "/onBroadcastInput" });
  return;
}

User.setProperty("admin_state", null, "string");

var userList = Bot.getProperty("user_list") || [];
if (userList.length === 0) {
  Bot.sendMessage("⚠️ <b>No users found in database to broadcast to.</b>", { parse_mode: "html" });
  Bot.runCommand("/admin");
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
  var tId = validTargets[j];
  try {
    if (photo) {
      var pArr = Array.isArray(photo) ? photo : [photo];
      var pId = pArr[pArr.length - 1].file_id;
      Api.sendPhoto({
        chat_id: tId,
        photo: pId,
        caption: caption ? ("📢 <b>Announcement:</b>\n\n" + caption) : "📢 <b>Announcement</b>",
        parse_mode: "html",
        on_error: "/onBroadcastError"
      });
      sentCount++;
    } else if (video) {
      Api.sendVideo({
        chat_id: tId,
        video: video.file_id,
        caption: caption ? ("📢 <b>Announcement:</b>\n\n" + caption) : "📢 <b>Announcement</b>",
        parse_mode: "html",
        on_error: "/onBroadcastError"
      });
      sentCount++;
    } else if (doc) {
      Api.sendDocument({
        chat_id: tId,
        document: doc.file_id,
        caption: caption ? ("📢 <b>Announcement:</b>\n\n" + caption) : "📢 <b>Announcement</b>",
        parse_mode: "html",
        on_error: "/onBroadcastError"
      });
      sentCount++;
    } else if (audio) {
      Api.sendAudio({
        chat_id: tId,
        audio: audio.file_id,
        caption: caption ? ("📢 <b>Announcement:</b>\n\n" + caption) : "📢 <b>Announcement</b>",
        parse_mode: "html",
        on_error: "/onBroadcastError"
      });
      sentCount++;
    } else {
      Api.sendMessage({
        chat_id: tId,
        text: "📢 <b>Announcement:</b>\n\n" + input,
        parse_mode: "html",
        on_error: "/onBroadcastError"
      });
      sentCount++;
    }
  } catch (err) {
    apiErrorCount++;
  }
}

var totalFailed = apiErrorCount + bannedCount + invalidCount;
var successRate = userList.length > 0 ? ((sentCount / userList.length) * 100).toFixed(1) : "100.0";

// Record stats
var bStats = {
  total: userList.length,
  targets: validTargets.length,
  dispatched: sentCount,
  failed: totalFailed,
  banned: bannedCount,
  invalid: invalidCount,
  timestamp: new Date().toISOString()
};
Bot.setProperty("broadcast_stats", bStats, "json");

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
