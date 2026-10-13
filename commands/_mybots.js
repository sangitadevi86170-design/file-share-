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

var buttons = [];

for (var i = 0; i < botsList.length; i++) {
  var b = botsList[i];
  var title = b.title || b.username || ("Bot #" + (i + 1));
  var link = b.link || ("https://t.me/" + b.username.replace("@", ""));

  text += (i + 1) + ". 🔹 <b>" + title + "</b>\n" +
    "   • Handle: " + b.username + "\n" +
    "   • Link: " + link + "\n\n";

  buttons.push([
    { text: "🤖 Open " + title, url: link, style: "success" }
  ]);
}

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid == adminId) {
  buttons.push([
    { text: "⚙️ Manage Bots (Admin)", callback_data: "/managebots", style: "primary" }
  ]);
}

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
