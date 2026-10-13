/*CMD
  command: /delchannel
  help: Remove/disable Force Subscribe channel
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

Bot.setProperty("fsub_channel", null, "string");
Bot.sendMessage("✅ <b>Force Subscribe has been disabled!</b>\nUsers can now download files without joining any channel.", { parse_mode: "html" });
