/*CMD
  command: /setdbchannel
  help: Set private database storage channel
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /storagechannel
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var channelInput = params ? params.trim() : "";

if (!channelInput) {
  var currentDb = Bot.getProperty("db_channel") || "Not Configured";
  Bot.sendMessage(
    "📦 <b>DATABASE / STORAGE CHANNEL SETUP:</b>\n\n" +
    "• <b>Current Channel:</b> <code>" + currentDb + "</code>\n\n" +
    "To set a private channel for file storage:\n" +
    "1️⃣ Create a private channel in Telegram.\n" +
    "2️⃣ Add this bot as an <b>Admin</b> in that channel with 'Post Messages' permission.\n" +
    "3️⃣ Send: <code>/setdbchannel &lt;Channel_ID&gt;</code>\n\n" +
    "<i>Example:</i> <code>/setdbchannel -1001234567890</code>\n" +
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
  "Now, every file uploaded to this bot will automatically be stored and backed up in this private channel!",
  { parse_mode: "html" }
);
