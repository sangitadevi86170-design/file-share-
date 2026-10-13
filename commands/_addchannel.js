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

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var text = "➕ <b>SELECT CHANNEL TYPE TO ADD:</b>\n\n" +
  "Choose the type of channel you want to link for Force Subscribe:\n\n" +
  "1️⃣ 🌐 <b>Public Channel:</b>\n" +
  "Has a public username (e.g. <code>@MyChannel</code>). Easiest to configure.\n\n" +
  "2️⃣ 🔒 <b>Private Channel:</b>\n" +
  "Uses a private invite link (e.g. <code>https://t.me/+join_hash</code>) and channel ID (<code>-100...</code>).\n\n" +
  "3️⃣ 📝 <b>Request Channel:</b>\n" +
  "Has 'Request to Join / Admin Approval' enabled. Users can unlock files once they send a join request!";

var buttons = [
  [
    { text: "🌐 1. Public Channel", callback_data: "/addchannel_type public", style: "primary" }
  ],
  [
    { text: "🔒 2. Private Channel", callback_data: "/addchannel_type private", style: "primary" }
  ],
  [
    { text: "📝 3. Request Channel", callback_data: "/addchannel_type request", style: "primary" }
  ],
  [
    { text: "🔙 Cancel & Back", callback_data: "/fsubchannels", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
