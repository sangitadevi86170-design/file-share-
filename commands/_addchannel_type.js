/*CMD
  command: /addchannel_type
  help: Route to the first input step of chosen channel type
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 🌐 Public Channel, 🔒 Private Channel, 📝 Request Channel
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var p = (params || message || "").toLowerCase();
var type = "public";
if (p.indexOf("request") !== -1) {
  type = "request";
} else if (p.indexOf("private") !== -1) {
  type = "private";
} else if (p.indexOf("public") !== -1) {
  type = "public";
}

var navKeyboard = [
  [
    { text: "🔙 Back to Channels", style: "primary" },
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

if (type === "public") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "🌐 <b>ADDING PUBLIC CHANNEL:</b>\n\n" +
      "Please send the <b>Public Channel Username</b> now:\n" +
      "<i>Example:</i> <code>@MyChannel</code>\n\n" +
      "⚠️ <i>Make sure the bot is an <b>Admin</b> in this channel!</i>\n\n" +
      "<i>Or tap [ 🔙 Back to Channels ] below to cancel.</i>",
    parse_mode: "html",
    reply_markup: {
      keyboard: navKeyboard,
      resize_keyboard: true,
      is_persistent: true
    }
  });
  Bot.run({ command: "/onPublicInput" });
} else if (type === "private") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "🔒 <b>ADDING PRIVATE CHANNEL (Step 1 of 2):</b>\n\n" +
      "Please send the Channel's <b>Chat ID</b> now:\n" +
      "<i>Example:</i> <code>-1001234567890</code>\n\n" +
      "⚠️ <i>Make sure the bot is an <b>Admin</b> in this channel!</i>\n\n" +
      "<i>Or tap [ 🔙 Back to Channels ] below to cancel.</i>",
    parse_mode: "html",
    reply_markup: {
      keyboard: navKeyboard,
      resize_keyboard: true,
      is_persistent: true
    }
  });
  Bot.run({ command: "/onPrivateChatId" });
} else if (type === "request") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "📝 <b>ADDING PRIVATE REQUEST CHANNEL (Step 1 of 2):</b>\n\n" +
      "Please send the Request Channel's <b>Chat ID</b> now:\n" +
      "<i>Example:</i> <code>-1001234567890</code>\n\n" +
      "💡 <i>Users with pending join requests will automatically be approved to download files!</i>\n" +
      "⚠️ <i>Make sure the bot is an <b>Admin</b> in this channel!</i>\n\n" +
      "<i>Or tap [ 🔙 Back to Channels ] below to cancel.</i>",
    parse_mode: "html",
    reply_markup: {
      keyboard: navKeyboard,
      resize_keyboard: true,
      is_persistent: true
    }
  });
  Bot.run({ command: "/onRequestChatId" });
}
