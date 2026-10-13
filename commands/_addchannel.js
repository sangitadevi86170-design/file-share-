/*CMD
  command: /addchannel
  help: Select type of Force Subscribe channel to add
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

var text = "➕ <b>SELECT FORCE CHANNEL TYPE TO ADD:</b>\n\n" +
  "Choose the type of channel you want to add:\n\n" +
  "1️⃣ 🌐 <b>Public Channel:</b>\n" +
  "Asks for username (e.g. <code>@MyChannel</code>).\n\n" +
  "2️⃣ 🔒 <b>Private Channel:</b>\n" +
  "Step 1: Chat ID (<code>-100...</code>)\n" +
  "Step 2: Invite Link (<code>https://t.me/+...</code>)\n\n" +
  "3️⃣ 📝 <b>Private Request Channel (Join Approval):</b>\n" +
  "Step 1: Chat ID (<code>-100...</code>)\n" +
  "Step 2: Request Link (<code>https://t.me/+...</code>)\n" +
  "<i>Users with pending join requests will automatically be approved!</i>\n\n" +
  "👇 <i>Select an option below:</i>";

var replyKeyboard = [
  [
    { text: "🌐 Public Channel", style: "primary" },
    { text: "🔒 Private Channel", style: "primary" },
    { text: "📝 Request Channel", style: "primary" }
  ],
  [
    { text: "🔙 Back to Channels", style: "primary" },
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
