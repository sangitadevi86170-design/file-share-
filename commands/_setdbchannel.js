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

var navKeyboard = [
  [
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

if (!channelInput || channelInput === "Storage DB" || channelInput === "📦 Storage DB") {
  var currentDb = Bot.getProperty("db_channel") || "-1003772789858";
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "📦 <b>DATABASE / STORAGE CHANNEL SETUP:</b>\n\n" +
      "• <b>Current Backup Channel ID:</b> <code>" + currentDb + "</code>\n\n" +
      "Every uploaded file is automatically saved into this channel as a permanent database backup.\n\n" +
      "<b>To change the storage channel:</b>\n" +
      "1️⃣ Add this bot as an <b>Admin</b> in your channel with 'Post Messages' permission.\n" +
      "2️⃣ Send command: <code>/setdbchannel -100xxxxxxxxxx</code>\n\n" +
      "<i>To disable backup:</i> <code>/setdbchannel off</code>",
    parse_mode: "html",
    reply_markup: {
      keyboard: navKeyboard,
      resize_keyboard: true,
      is_persistent: true
    }
  });
  return;
}

if (channelInput.toLowerCase() === "off" || channelInput.toLowerCase() === "disable" || channelInput.toLowerCase() === "clear") {
  Bot.setProperty("db_channel", null, "string");
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "✅ <b>Database Channel Disabled!</b>\nFiles will no longer be forwarded to a backup channel.",
    parse_mode: "html",
    reply_markup: {
      keyboard: navKeyboard,
      resize_keyboard: true,
      is_persistent: true
    }
  });
  return;
}

Bot.setProperty("db_channel", channelInput, "string");

Api.sendMessage({
  chat_id: chat.chatid,
  text: "✅ <b>Database Channel Updated Successfully!</b>\n\n" +
    "• <b>Storage Channel ID:</b> <code>" + channelInput + "</code>\n\n" +
    "Every file uploaded will now automatically be backed up to this channel!",
  parse_mode: "html",
  reply_markup: {
    keyboard: navKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
