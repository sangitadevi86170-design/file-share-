/*CMD
  command: /setchannel
  help: Set Force Subscribe (FSUB) channel
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

var channelInput = params;
if (!channelInput) {
  Bot.sendMessage(
    "📢 <b>Force Subscribe Setup:</b>\n\n" +
    "To set a Force Subscribe channel, use:\n" +
    "<code>/setchannel @YourChannelUsername</code>\n\n" +
    "<i>⚠️ IMPORTANT: You must add this bot as an <b>Administrator</b> in your channel with invite/member management rights so it can verify subscribers!</i>",
    { parse_mode: "html" }
  );
  return;
}

channelInput = channelInput.trim();
Bot.setProperty("fsub_channel", channelInput, "string");

Bot.sendMessage(
  "✅ <b>Force Subscribe Channel Updated!</b>\n\n" +
  "• <b>Active Channel:</b> <code>" + channelInput + "</code>\n\n" +
  "Users will now be forced to join this channel before getting files!\n" +
  "<i>Make sure the bot is an admin in the channel.</i>",
  { parse_mode: "html" }
);
