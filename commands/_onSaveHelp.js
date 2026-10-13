/*CMD
  command: /onSaveHelp
  help: Save the new support username entered by admin
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

var input = (message || "").trim();

if (!input || input === "/cancel" || input === "🔙 Main Menu") {
  Bot.sendMessage("❌ Operation cancelled. Returning to Admin Panel.", { parse_mode: "html" });
  Bot.runCommand("/admin");
  return;
}

var cleanUser = input.replace("@", "").trim();
Bot.setProperty("support_username", cleanUser, "string");

var adminReplyKeyboard = [
  [
    { text: "📁 All Files", style: "primary" },
    { text: "📈 All Traffic", style: "primary" },
    { text: "📢 Force Channels", style: "primary" }
  ],
  [
    { text: "🔐 Button Locker", style: "primary" },
    { text: "🛡️ Protect Content", style: "primary" },
    { text: "📦 Storage DB", style: "success" }
  ],
  [
    { text: "💬 Set Support", style: "primary" },
    { text: "📢 Broadcast", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "✅ <b>Support Contact Updated Successfully!</b>\n\n" +
    "• <b>New Support Username:</b> @" + cleanUser + "\n" +
    "• Users clicking <b>ℹ️ Help</b> will now directly see: <a href=\"https://t.me/" + cleanUser + "\">@" + cleanUser + "</a>",
  parse_mode: "html",
  reply_markup: {
    keyboard: adminReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
