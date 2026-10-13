/*CMD
  command: /unban
  help: Unban a previously banned user
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
    "✅ <b>Unban User Usage:</b>\n\nSend: <code>/unban &lt;user_id&gt;</code>\nExample: <code>/unban 123456789</code>",
    { parse_mode: "html" }
  );
  return;
}

var bannedUsers = Bot.getProperty("banned_users") || [];
var index = bannedUsers.indexOf(targetId);

if (index > -1) {
  bannedUsers.splice(index, 1);
  Bot.setProperty("banned_users", bannedUsers, "json");
  Bot.sendMessage("✅ <b>User Unbanned:</b> <code>" + targetId + "</code> has been restored.", { parse_mode: "html" });
} else {
  Bot.sendMessage("⚠️ User <code>" + targetId + "</code> is not in the ban list.", { parse_mode: "html" });
}
