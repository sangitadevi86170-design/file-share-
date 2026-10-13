/*CMD
  command: /setadmin
  help: Claim or transfer admin privileges
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var currentAdmin = Bot.getProperty("admin_id");

// If no admin is configured, first user to call this claims admin
if (!currentAdmin) {
  Bot.setProperty("admin_id", user.telegramid, "string");
  Bot.sendMessage(
    "🎉 <b>Success!</b>\nYou have been registered as the bot Admin!\nAdmin ID: <code>" + user.telegramid + "</code>\nUse /admin to configure your bot.",
    { parse_mode: "html" }
  );
  return;
}

// If already admin, allow transferring ownership
if (user.telegramid == currentAdmin) {
  var newAdminId = params;
  if (!newAdminId) {
    Bot.sendMessage(
      "👑 <b>Current Admin ID:</b> <code>" + currentAdmin + "</code>\n\n" +
      "To transfer admin rights to someone else, use:\n<code>/setadmin &lt;New_Telegram_ID&gt;</code>",
      { parse_mode: "html" }
    );
    return;
  }
  
  newAdminId = newAdminId.trim();
  Bot.setProperty("admin_id", newAdminId, "string");
  Bot.sendMessage(
    "✅ <b>Admin Rights Transferred!</b>\nNew Admin ID: <code>" + newAdminId + "</code>",
    { parse_mode: "html" }
  );
  return;
}

// If unauthorized user
Bot.sendMessage("⛔ <b>Unauthorized:</b> Admin rights are already claimed by another user.", { parse_mode: "html" });
