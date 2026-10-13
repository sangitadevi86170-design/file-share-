/*CMD
  command: /delbot
  help: Remove a bot from the 'My Bots' list
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

var param = params ? params.trim() : "";
var botsList = Bot.getProperty("my_bots_list") || [];

if (botsList.length === 0) {
  Bot.sendMessage("ℹ️ No bots in network to remove.", { parse_mode: "html" });
  return;
}

var idx = parseInt(param);
if (!isNaN(idx) && idx >= 0 && idx < botsList.length) {
  var removed = botsList.splice(idx, 1)[0];
  Bot.setProperty("my_bots_list", botsList, "json");
  Bot.sendMessage("✅ <b>Removed Bot:</b> " + (removed.title || removed.username), { parse_mode: "html" });
  Bot.runCommand("/managebots");
  return;
}

// Search by username
var filtered = [];
var found = false;
for (var i = 0; i < botsList.length; i++) {
  if (botsList[i].username.toLowerCase() === param.toLowerCase()) {
    found = true;
  } else {
    filtered.push(botsList[i]);
  }
}

if (found) {
  Bot.setProperty("my_bots_list", filtered, "json");
  Bot.sendMessage("✅ <b>Removed Bot:</b> <code>" + param + "</code>", { parse_mode: "html" });
  Bot.runCommand("/managebots");
} else {
  Bot.sendMessage("⚠️ Bot not found.", { parse_mode: "html" });
}
