/*CMD
  command: /mybots
  help: View all recommended and network bots by the admin
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 🤖 My Bots, My Bots
  group: 
CMD*/

var bannedUsers = Bot.getProperty("banned_users") || [];
if (bannedUsers.indexOf(user.telegramid) !== -1) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You are banned from using this bot.", { parse_mode: "html" });
  return;
}

var botsList = Bot.getProperty("my_bots_list") || [];

if (botsList.length === 0) {
  Bot.sendMessage(
    "🤖 <b>OUR BOT NETWORK:</b>\n\n" +
    "<i>No other bots have been added to the network yet. Please check back later!</i>",
    { parse_mode: "html" }
  );
  return;
}

var text = "🤖 <b>EXPLORE OUR TELEGRAM BOTS (" + botsList.length + "):</b>\n\n" +
  "Here are all our official Telegram bots. Tap any button below to start using them:\n\n";

for (var i = 0; i < botsList.length; i++) {
  var b = botsList[i];
  var title = b.title || b.username || ("Bot #" + (i + 1));
  var link = b.link || ("https://t.me/" + b.username.replace("@", ""));

  text += (i + 1) + ". 🔹 <b>" + title + "</b> (" + b.username + ")\n" +
    "   👉 <b>Link:</b> " + link + "\n\n";
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid == adminId) {
  text += "⚙️ <i>Admin: Manage network bots via:</i> <code>/managebots</code>\n\n";
}

text += "<i>Use the 3x3 menu buttons below to navigate:</i>";

var replyKeyboard = (user.telegramid == adminId) ? [
  [
    { text: "📁 My Files", style: "primary" },
    { text: "📤 Upload File", style: "success" },
    { text: "📊 My Traffic", style: "primary" }
  ],
  [
    { text: "🤖 My Bots", style: "primary" },
    { text: "📊 Bot Stats", style: "primary" },
    { text: "ℹ️ Help", style: "primary" }
  ],
  [
    { text: "👑 Admin Panel", style: "primary" },
    { text: "📦 Storage DB", style: "success" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
] : [
  [
    { text: "📁 My Files", style: "primary" },
    { text: "📤 Upload File", style: "success" },
    { text: "📊 My Traffic", style: "primary" }
  ],
  [
    { text: "🤖 My Bots", style: "primary" },
    { text: "📊 Bot Stats", style: "primary" },
    { text: "ℹ️ Help", style: "primary" }
  ],
  [
    { text: "🤖 About Bot", style: "primary" },
    { text: "🔄 Refresh", style: "success" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
