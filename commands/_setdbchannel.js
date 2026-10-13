/*CMD
  command: /setdbchannel
  help: Set private database storage channel
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 📦 Storage DB, Storage DB, /storagechannel
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var channelInput = params ? params.trim() : "";

if (!channelInput) {
  var currentDb = Bot.getProperty("db_channel") || "-1003772789858";
  Bot.sendMessage(
    "📦 <b>DATABASE / STORAGE CHANNEL SETUP:</b>\n\n" +
    "• <b>Current Channel ID:</b> <code>" + currentDb + "</code>\n\n" +
    "To change the storage channel:\n" +
    "1️⃣ Add this bot as an <b>Admin</b> in that channel with 'Post Messages' permission.\n" +
    "2️⃣ Send: <code>/setdbchannel &lt;Channel_ID&gt;</code>\n\n" +
    "<i>Example:</i> <code>/setdbchannel -1003772789858</code>\n" +
    "<i>To disable:</i> <code>/setdbchannel off</code>",
    { parse_mode: "html" }
  );
  return;
}

if (channelInput.toLowerCase() === "off" || channelInput.toLowerCase() === "disable" || channelInput.toLowerCase() === "clear") {
  Bot.setProperty("db_channel", null, "string");
  Bot.sendMessage("✅ <b>Database Channel Disabled!</b> Files will no longer be forwarded to a private channel.", { parse_mode: "html" });
  return;
}

Bot.setProperty("db_channel", channelInput, "string");

Bot.sendMessage(
  "✅ <b>Database Channel Updated Successfully!</b>\n\n" +
  "• <b>Storage Channel ID:</b> <code>" + channelInput + "</code>\n\n" +
  "Every file uploaded will automatically be backed up to this channel!",
  { parse_mode: "html" }
);
