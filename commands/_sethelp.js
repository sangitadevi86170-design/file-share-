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

if (params && params !== "Set Support" && params !== "💬 Set Support") {
  var cleanUser = params.replace("@", "").trim();
  Bot.setProperty("support_username", cleanUser, "string");
  
  Bot.sendMessage(
    "✅ <b>Support Username Updated Successfully!</b>\n\n" +
    "• <b>Support Contact:</b> @" + cleanUser + "\n\n" +
    "Users tapping <b>ℹ️ Help</b> will now directly see this contact.",
    { parse_mode: "html" }
  );
  return;
}

User.setProperty("admin_state", "waiting_support_username", "string");

var navKeyboard = [
  [
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "💬 <b>SET SUPPORT USERNAME</b>\n\n" +
    "• <b>Current Support Contact:</b> @" + currentSupport + "\n\n" +
    "Please send the new Telegram username to display in <b>ℹ️ Help</b>:\n" +
    "<i>Example: SupportBot or @AdminUser</i>\n\n" +
    "<i>Or tap [ 👑 Admin Panel ] to cancel.</i>",
  parse_mode: "html",
  reply_markup: {
    keyboard: navKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
