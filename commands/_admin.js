/*CMD
  command: /admin
  help: Open the Bot Admin Panel
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");

// If no admin is configured, allow current user to claim
if (!adminId) {
  Bot.setProperty("admin_id", user.telegramid, "string");
  adminId = user.telegramid;
}

if (user.telegramid != adminId) {
  Bot.sendMessage(
    "⛔ <b>Access Denied!</b>\n\nYou are not registered as the admin for this bot.\nIf you are the owner, send /setadmin to configure.",
    { parse_mode: "html" }
  );
  return;
}

// Gather live stats
var userList = Bot.getProperty("user_list") || [];
var totalUsers = userList.length;
var totalFiles = Bot.getProperty("total_files") || 0;
var channels = Bot.getProperty("fsub_channels") || [];
var downloadLogs = Bot.getProperty("download_logs") || [];
var publicUpload = Bot.getProperty("public_upload") ? "✅ Open" : "🔒 Admin Only";
var protectContent = Bot.getProperty("protect_content") ? "🛡️ Enabled (No Forward/Save)" : "🔓 Disabled";
var lockedButtons = Bot.getProperty("locked_buttons") || {};
var lockedCount = 0;
for (var k in lockedButtons) {
  if (lockedButtons[k]) lockedCount++;
}

var botUsername = Bot.getProperty("bot_username") || "FileShareBot";

var adminText = "👑 <b>ULTIMATE ADMINISTRATOR CONTROL PANEL</b>\n\n" +
  "📊 <b>Bot Health & Statistics:</b>\n" +
  "• <b>Admin ID:</b> <code>" + adminId + "</code>\n" +
  "• <b>Bot Handle:</b> @" + botUsername + "\n" +
  "• <b>Total Registered Users:</b> " + totalUsers + "\n" +
  "• <b>Total Stored Files:</b> " + totalFiles + "\n" +
  "• <b>Logged Downloads:</b> " + downloadLogs.length + "\n" +
  "• <b>Force Channels:</b> " + channels.length + " (Public/Private/Request)\n" +
  "• <b>Content Protection:</b> " + protectContent + "\n" +
  "• <b>Public Upload:</b> " + publicUpload + "\n" +
  "• <b>Locked Features:</b> " + lockedCount + " buttons locked\n\n" +
  "🛠️ <b>Quick Control Actions:</b>\n" +
  "Tap any option below to manage your bot:";

var buttons = [
  [
    { text: "📁 File Manager & Rename", callback_data: "/files" },
    { text: "📈 Traffic & Downloads", callback_data: "/traffic" }
  ],
  [
    { text: "📢 Force Channels (3 Types)", callback_data: "/fsubchannels" },
    { text: "🔐 Button Locker", callback_data: "/buttonlock" }
  ],
  [
    { text: "🛡️ Content Protection", callback_data: "/protectcontent" },
    { text: "🔄 Toggle Public Upload", callback_data: "/publicupload" }
  ],
  [
    { text: "📢 Broadcast Message", callback_data: "/broadcast" },
    { text: "📊 Full Analytics", callback_data: "/stats" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: adminText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
