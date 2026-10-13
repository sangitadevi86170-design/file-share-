/*CMD
  command: /addchannel_type
  help: Guide admin to input details for chosen channel type
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

var type = params ? params.trim().toLowerCase() : "public";
User.setProperty("adding_channel_type", type, "string");

var promptText = "";

if (type === "public") {
  promptText = "🌐 <b>ADDING PUBLIC CHANNEL:</b>\n\n" +
    "Send the channel username in this format:\n" +
    "<code>@YourChannelUsername Channel_Title</code>\n\n" +
    "<i>Example:</i> <code>@MyMoviesChannel Official Updates</code>\n" +
    "<i>(Or just <code>@MyMoviesChannel</code>)</i>\n\n" +
    "⚠️ <b>Reminder:</b> Add this bot as an <b>Admin</b> in the channel!";
} else if (type === "private") {
  promptText = "🔒 <b>ADDING PRIVATE CHANNEL:</b>\n\n" +
    "Send the Channel ID and Invite Link in this format:\n" +
    "<code>&lt;Channel_ID&gt; &lt;Invite_Link&gt; &lt;Title&gt;</code>\n\n" +
    "<i>Example:</i> <code>-1001234567890 https://t.me/+AbCdEfGhIj Private Backup</code>\n\n" +
    "⚠️ <b>Reminder:</b> Add this bot as an <b>Admin</b> in your channel!";
} else if (type === "request") {
  promptText = "📝 <b>ADDING REQUEST CHANNEL (Join Approval):</b>\n\n" +
    "Send the Channel ID and Request Link in this format:\n" +
    "<code>&lt;Channel_ID&gt; &lt;Request_Link&gt; &lt;Title&gt;</code>\n\n" +
    "<i>Example:</i> <code>-1009876543210 https://t.me/+ReqLinkJoin VIP Members</code>\n\n" +
    "💡 <i>Users who submit a Join Request will be verified to get the file!</i>\n" +
    "⚠️ <b>Reminder:</b> Add this bot as an <b>Admin</b> in your channel!";
}

Bot.sendMessage(promptText, { parse_mode: "html" });
Bot.runCommand("/onSaveChannel");
