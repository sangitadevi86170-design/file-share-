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

// Gather stats
var userList = Bot.getProperty("user_list") || [];
var totalUsers = userList.length;
var totalFiles = Bot.getProperty("total_files") || 0;
var fsubChannel = Bot.getProperty("fsub_channel") || "❌ Disabled";
var publicUpload = Bot.getProperty("public_upload") ? "✅ Enabled" : "❌ Disabled (Admin Only)";
var botUsername = Bot.getProperty("bot_username") || "Not Synced (Run /start)";

var adminText = "👑 <b>ADMINISTRATOR CONTROL PANEL</b>\n\n" +
  "📊 <b>Bot Overview:</b>\n" +
  "• <b>Admin ID:</b> <code>" + adminId + "</code>\n" +
  "• <b>Bot Handle:</b> @" + botUsername + "\n" +
  "• <b>Total Users:</b> " + totalUsers + "\n" +
  "• <b>Total Stored Files:</b> " + totalFiles + "\n" +
  "• <b>Force Subscribe Channel:</b> <code>" + fsubChannel + "</code>\n" +
  "• <b>Public Upload:</b> " + publicUpload + "\n\n" +
  "⚙️ <b>Quick Admin Commands:</b>\n" +
  "• <code>/setchannel @YourChannel</code> — Set Force Join Channel\n" +
  "• <code>/delchannel</code> — Remove Force Join Channel\n" +
  "• <code>/broadcast &lt;text&gt;</code> — Send message to all users\n" +
  "• <code>/files</code> — View recently uploaded files\n" +
  "• <code>/deletefile &lt;code&gt;</code> — Delete a stored file\n" +
  "• <code>/publicupload on</code> or <code>off</code> — Allow/block user uploads\n" +
  "• <code>/stats</code> — Detailed bot statistics";

var buttons = [
  [
    { text: "📊 Full Stats", callback_data: "/stats" },
    { text: "📁 Recent Files", callback_data: "/files" }
  ],
  [
    { text: "📢 Set Channel", callback_data: "/setchannel" },
    { text: "❌ Disable FSUB", callback_data: "/delchannel" }
  ],
  [
    { text: "🔄 Toggle Public Upload", callback_data: "/publicupload" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: adminText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
