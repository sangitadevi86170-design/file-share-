/*CMD
  command: /fsubchannels
  help: Manage Force Subscribe channels (Public, Private, Request)
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 📢 Force Channels, Force Channels, /channels, 🔙 Back to Channels, Back to Channels
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var channels = Bot.getProperty("fsub_channels") || [];

var text = "📢 <b>FORCE SUBSCRIBE CHANNELS MANAGER</b>\n\n" +
  "You can configure 3 types of channels:\n" +
  "• 🌐 <b>Public Channel:</b> Direct @username link\n" +
  "• 🔒 <b>Private Channel:</b> Invite link (-100... ID)\n" +
  "• 📝 <b>Request Channel:</b> Join-Request / Pending-Approval link\n\n" +
  "━━━━━━━━━━━━━━━━━━━━\n" +
  "📋 <b>ACTIVE CHANNELS (" + channels.length + "):</b>\n\n";

if (channels.length === 0) {
  text += "<i>No channels configured yet. Users can download files directly.</i>\n\n";
} else {
  for (var i = 0; i < channels.length; i++) {
    var ch = channels[i];
    var badge = (ch.type === "request") ? "📝 [REQUEST]" : ((ch.type === "private") ? "🔒 [PRIVATE]" : "🌐 [PUBLIC]");
    text += (i + 1) + ". " + badge + " <b>" + (ch.title || ch.id) + "</b>\n" +
      "   • ID: <code>" + ch.id + "</code>\n" +
      "   • Link: " + ch.link + "\n" +
      "   • 🗑️ <b>Remove:</b> /delchannel_" + (i + 1) + "\n\n";
  }
}

text += "👇 <i>Tap an option below to add a channel:</i>";

var fsubReplyKeyboard = [
  [
    { text: "🌐 Public Channel", style: "primary" },
    { text: "🔒 Private Channel", style: "primary" },
    { text: "📝 Request Channel", style: "primary" }
  ],
  [
    { text: "🗑️ Remove All Channels", style: "danger" },
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: fsubReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
