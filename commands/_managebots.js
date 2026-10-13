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

var buttons = [];

if (botsList.length === 0) {
  text += "<i>No bots added yet. Tap 'Add New Bot' below to start building your network list!</i>\n";
} else {
  for (var i = 0; i < botsList.length; i++) {
    var b = botsList[i];
    var title = b.title || b.username;
    text += (i + 1) + ". 🔹 <b>" + title + "</b> (" + b.username + ")\n" +
      "   • Link: " + b.link + "\n\n";

    buttons.push([
      { text: "🗑️ Remove #" + (i + 1) + " (" + title + ")", callback_data: "/delbot " + i, style: "danger" }
    ]);
  }
}

buttons.push([
  { text: "➕ Add New Bot", callback_data: "/addbot", style: "success" }
]);

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
