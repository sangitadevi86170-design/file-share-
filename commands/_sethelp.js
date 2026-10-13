/*CMD
  command: /sethelp
  help: Set Support Contact Username for Help Menu
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 💬 Set Support, Set Support, /support
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var currentSupport = Bot.getProperty("support_username") || "sangitadevi86170";

if (params) {
  var cleanUser = params.replace("@", "").trim();
  Bot.setProperty("support_username", cleanUser, "string");
  
  Bot.sendMessage(
    "✅ <b>Support Username Updated!</b>\n\n" +
    "Support username is now set to: <b>@" + cleanUser + "</b>\n" +
    "Users clicking <b>ℹ️ Help</b> will now see this contact.",
    { parse_mode: "html" }
  );
  return;
}

Bot.sendMessage(
  "💬 <b>SET SUPPORT USERNAME</b>\n\n" +
  "Current Support Contact: <b>@" + currentSupport + "</b>\n\n" +
  "Please send the new Telegram username (with or without @) to show users in <b>ℹ️ Help</b>:\n" +
  "<i>Example: SupportBot or @AdminUser</i>\n\n" +
  "<i>Send /cancel to return without changing.</i>",
  { parse_mode: "html" }
);

Bot.run({ command: "/onSaveHelp" });
