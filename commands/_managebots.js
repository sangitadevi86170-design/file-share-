/*CMD
  command: /managebots
  help: Admin control panel to add, view, or remove network bots
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var botsList = Bot.getProperty("my_bots_list") || [];

var text = "🤖 <b>'MY BOTS' NETWORK MANAGER</b>\n\n" +
  "Manage all the Telegram bots shown to your users under the <b>🤖 My Bots</b> button.\n\n" +
  "📋 <b>ACTIVE BOTS (" + botsList.length + "):</b>\n\n";

if (botsList.length === 0) {
  text += "<i>No bots added yet. Use /addbot to add a bot to your network!</i>\n\n";
} else {
  for (var i = 0; i < botsList.length; i++) {
    var b = botsList[i];
    var title = b.title || b.username;
    text += (i + 1) + ". 🔹 <b>" + title + "</b> (" + b.username + ")\n" +
      "   • Link: " + b.link + "\n" +
      "   • 🗑️ <b>Remove:</b> /delbot_" + (i + 1) + "\n\n";
  }
}

text += "➕ <b>Add New Bot:</b> /addbot";

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
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: adminReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
