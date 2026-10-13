/*CMD
  command: /publicupload
  help: Toggle whether all users can upload files or admin only
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

var currentMode = Bot.getProperty("public_upload") || false;
var param = params ? params.trim().toLowerCase() : "";

var newMode;
if (param === "on" || param === "true" || param === "enable") {
  newMode = true;
} else if (param === "off" || param === "false" || param === "disable") {
  newMode = false;
} else {
  // Toggle
  newMode = !currentMode;
}

Bot.setProperty("public_upload", newMode, "boolean");

var statusText = newMode ? "✅ <b>ENABLED (Anyone can upload files)</b>" : "🔒 <b>DISABLED (Admin only can upload)</b>";

Bot.sendMessage(
  "⚙️ <b>Public Upload Setting Updated!</b>\n\nStatus: " + statusText + "\n\n" +
  "• To switch, send <code>/publicupload on</code> or <code>/publicupload off</code>",
  { parse_mode: "html" }
);
