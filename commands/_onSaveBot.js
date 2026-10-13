/*CMD
  command: /onSaveBot
  help: Parse and save the new bot to the network list
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) return;

var input = message ? message.trim() : "";
if (!input) {
  Bot.sendMessage("⚠️ Input cannot be empty. Bot not added.");
  return;
}

var parts = input.split(" ");
var username = parts[0];

if (username.indexOf("@") !== 0 && username.indexOf("http") !== 0) {
  username = "@" + username;
}

var link = "";
var cleanHandle = username;

if (username.indexOf("http") === 0) {
  link = username;
  cleanHandle = username.split("/").pop();
  if (cleanHandle.indexOf("@") !== 0) cleanHandle = "@" + cleanHandle;
} else {
  link = "https://t.me/" + username.replace("@", "");
}

var title = parts.length > 1 ? parts.slice(1).join(" ") : cleanHandle;

var botsList = Bot.getProperty("my_bots_list") || [];

// Check if already in list
var exists = false;
for (var i = 0; i < botsList.length; i++) {
  if (botsList[i].username.toLowerCase() === cleanHandle.toLowerCase()) {
    botsList[i].title = title;
    botsList[i].link = link;
    exists = true;
    break;
  }
}

if (!exists) {
  botsList.push({
    username: cleanHandle,
    title: title,
    link: link
  });
}

Bot.setProperty("my_bots_list", botsList, "json");

Bot.sendMessage(
  "✅ <b>Bot Added to 'My Bots' Successfully!</b>\n\n" +
  "• <b>Title:</b> " + title + "\n" +
  "• <b>Username:</b> " + cleanHandle + "\n" +
  "• <b>Link:</b> " + link + "\n\n" +
  "<i>Users tapping '🤖 My Bots' will now see this bot in their list!</i>",
  { parse_mode: "html" }
);

Bot.runCommand("/managebots");
