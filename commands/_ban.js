/*CMD
  command: /ban
  help: Ban a user from using the bot
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var targetId = params ? params.trim() : "";
if (!targetId) {
  Bot.sendMessage(
    "🚫 <b>Ban User Usage:</b>\n\nSend: <code>/ban &lt;user_id&gt;</code>\nExample: <code>/ban 123456789</code>",
    { parse_mode: "html" }
  );
  return;
}

var bannedUsers = Bot.getProperty("banned_users") || [];
if (bannedUsers.indexOf(targetId) === -1) {
  bannedUsers.push(targetId);
  Bot.setProperty("banned_users", bannedUsers, "json");
}

Bot.sendMessage("🚫 <b>User Banned:</b> <code>" + targetId + "</code> can no longer download or upload files.", { parse_mode: "html" });
