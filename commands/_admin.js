/*CMD
  command: /admin
  help: Open the Bot Admin Panel
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 👑 Admin Panel, Admin Panel
  group: 
CMD*/

var adminId = "8710308658";
Bot.setProperty("admin_id", adminId, "string");

if (user.telegramid != adminId) {
  Bot.sendMessage(
    "⛔ <b>Access Denied:</b> This area is reserved for the bot administrator only.",
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
var dbChannel = Bot.getProperty("db_channel") || "Not Configured";
var publicUpload = Bot.getProperty("public_upload") !== false ? "✅ Open for All" : "🔒 Admin Only";
var protectContent = Bot.getProperty("protect_content") ? "🛡️ Enabled (No Forward/Save)" : "🔓 Disabled";
var lockedButtons = Bot.getProperty("locked_buttons") || {};
var lockedCount = 0;
for (var k in lockedButtons) {
  if (lockedButtons[k]) lockedCount++;
}

var botUsername = Bot.getProperty("bot_username") || "FileShareBot";

var adminText = "👑 <b>ADMINISTRATOR CONTROL PANEL</b>\n\n" +
  "📊 <b>Bot Statistics & Overview:</b>\n" +
  "• <b>Admin ID:</b> <code>" + adminId + "</code>\n" +
  "• <b>Bot Handle:</b> @" + botUsername + "\n" +
  "• <b>Total Users:</b> " + totalUsers + "\n" +
  "• <b>Total Stored Files:</b> " + totalFiles + "\n" +
  "• <b>Logged Downloads:</b> " + downloadLogs.length + "\n" +
  "• <b>Force Channels:</b> " + channels.length + " (Public/Private/Request)\n" +
  "• <b>Database Storage Channel:</b> <code>" + dbChannel + "</code>\n" +
  "• <b>Content Protection:</b> " + protectContent + "\n" +
  "• <b>User Upload Access:</b> " + publicUpload + "\n" +
  "• <b>Locked Features:</b> " + lockedCount + " buttons locked\n\n" +
  "👇 <i>Use the reply keyboard below or tap quick actions:</i>";

var adminReplyKeyboard = [
  [
    { text: "📁 All Files" },
    { text: "📈 All Traffic" }
  ],
  [
    { text: "📢 Force Channels" },
    { text: "🔐 Button Locker" }
  ],
  [
    { text: "🛡️ Protect Content" },
    { text: "📢 Broadcast" }
  ],
  [
    { text: "🔙 Main Menu" }
  ]
];

var inlineButtons = [
  [
    { text: "📁 File Manager", callback_data: "/files", style: "primary" },
    { text: "📈 Global Traffic", callback_data: "/traffic", style: "primary" }
  ],
  [
    { text: "📢 Force Channels (3 Types)", callback_data: "/fsubchannels", style: "primary" },
    { text: "🔐 Button Locker", callback_data: "/buttonlock", style: "primary" }
  ],
  [
    { text: "📦 Set DB Channel", callback_data: "/setdbchannel", style: "primary" },
    { text: "🛡️ Content Protection", callback_data: "/protectcontent", style: "primary" }
  ]
];

// Send Reply Keyboard so admin has persistent buttons
Api.sendMessage({
  chat_id: chat.chatid,
  text: adminText,
  parse_mode: "html",
  reply_markup: {
    keyboard: adminReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});

// Also send inline quick action panel
Api.sendMessage({
  chat_id: chat.chatid,
  text: "🛠️ <b>Quick Admin Actions:</b>",
  parse_mode: "html",
  reply_markup: { inline_keyboard: inlineButtons }
});
