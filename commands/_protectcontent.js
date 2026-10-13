/*CMD
  command: /protectcontent
  help: Toggle content protection (prevents file forwarding and saving)
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /protect
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var current = Bot.getProperty("protect_content") || false;
var param = params ? params.trim().toLowerCase() : "";

var newStatus;
if (param === "on" || param === "enable" || param === "true") {
  newStatus = true;
} else if (param === "off" || param === "disable" || param === "false") {
  newStatus = false;
} else {
  newStatus = !current;
}

Bot.setProperty("protect_content", newStatus, "boolean");

var text = newStatus 
  ? "🛡️ <b>CONTENT PROTECTION ENABLED!</b>\n\nUsers can no longer forward or save files received from this bot to their device storage."
  : "🔓 <b>CONTENT PROTECTION DISABLED!</b>\n\nUsers are now allowed to forward and save files normally.";

Bot.sendMessage(text + "\n\n<i>To switch, send /protectcontent on or off</i>", { parse_mode: "html" });
Bot.runCommand("/admin");
