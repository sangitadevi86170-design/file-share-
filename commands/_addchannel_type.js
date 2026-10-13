/*CMD
  command: /addchannel_type
  help: Route to the first input step of chosen channel type
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

var type = params ? params.trim().toLowerCase() : "public";

if (type === "public") {
  Bot.sendMessage(
    "🌐 <b>ADDING PUBLIC CHANNEL:</b>\n\n" +
    "Please send the <b>Public Channel Username</b> now:\n" +
    "<i>Example:</i> <code>@MyChannel</code>\n\n" +
    "⚠️ <i>Make sure the bot is an <b>Admin</b> in this channel!</i>",
    { parse_mode: "html" }
  );
  Bot.runCommand("/onPublicInput");
} else if (type === "private") {
  Bot.sendMessage(
    "🔒 <b>ADDING PRIVATE CHANNEL (Step 1 of 2):</b>\n\n" +
    "Please send the Channel's <b>Chat ID</b> now:\n" +
    "<i>Example:</i> <code>-1001234567890</code>\n\n" +
    "⚠️ <i>Make sure the bot is an <b>Admin</b> in this channel!</i>",
    { parse_mode: "html" }
  );
  Bot.runCommand("/onPrivateChatId");
} else if (type === "request") {
  Bot.sendMessage(
    "📝 <b>ADDING PRIVATE REQUEST CHANNEL (Step 1 of 2):</b>\n\n" +
    "Please send the Request Channel's <b>Chat ID</b> now:\n" +
    "<i>Example:</i> <code>-1001234567890</code>\n\n" +
    "💡 <i>Users with pending join requests will automatically be approved to download files!</i>\n" +
    "⚠️ <i>Make sure the bot is an <b>Admin</b> in this channel!</i>",
    { parse_mode: "html" }
  );
  Bot.runCommand("/onRequestChatId");
}
