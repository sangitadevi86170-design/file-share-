/*CMD
  command: /help
  help: View all available commands and help guide
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: ℹ️ Help, Help
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
var isUserAdmin = (user.telegramid == adminId);
var locked = Bot.getProperty("locked_buttons") || {};

if (locked.help && !isUserAdmin) {
  Bot.sendMessage("🔒 <b>Feature Locked:</b> Help guide is currently locked by the administrator.", { parse_mode: "html" });
  return;
}

var helpText = "📖 <b>FILE SHARING BOT — COMPLETE USER & ADMIN MANUAL</b>\n\n" +
  "<b>👤 User Commands & Reply Buttons:</b>\n" +
  "• 📁 <b>My Files:</b> View, rename, edit captions, and manage your uploaded files\n" +
  "• 📊 <b>My Traffic:</b> See live list of who downloaded your files (Name, Chat ID, Time)\n" +
  "• 📤 <b>Upload File:</b> Instructions on how to upload documents, videos, photos, music\n" +
  "• /start — Main menu & activate persistent keyboard\n" +
  "• /help — Show this help manual\n\n";

if (isUserAdmin) {
  helpText += "<b>👑 Administrator Commands:</b>\n" +
    "• /admin — Open the Admin Dashboard\n" +
    "• 📁 <b>All Files:</b> Manage every file uploaded on the bot\n" +
    "• 📈 <b>All Traffic:</b> View global downloaders log across all files\n" +
    "• 📢 <b>Force Channels:</b> Set Public, Private, or Request Channels\n" +
    "• 🔐 <b>Button Locker:</b> Lock/unlock specific bot features\n" +
    "• 🛡️ <b>Protect Content:</b> Toggle forwarding/saving prevention\n" +
    "• /setdbchannel &lt;id&gt; — Set private storage backup channel\n" +
    "• /broadcast &lt;msg&gt; — Broadcast message to all bot users\n" +
    "• /ban &lt;id&gt; / /unban &lt;id&gt; — Ban/unban users\n\n";
}

helpText += "💡 <b>How to download files?</b>\n" +
  "Click any valid link formatted as:\n" +
  "<code>https://t.me/&lt;bot_username&gt;?start=&lt;file_key&gt;</code>";

var buttons = [
  [{ text: "📁 Open My Files", callback_data: "/myfiles", style: "primary" }],
  [{ text: "🔙 Back to Home", callback_data: "/start", style: "primary" }]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: helpText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
