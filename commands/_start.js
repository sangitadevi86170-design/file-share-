/*CMD
  command: /start
  help: Start the bot or get a shared file via link
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// 0. Check if user is banned
var bannedUsers = Bot.getProperty("banned_users") || [];
if (bannedUsers.indexOf(user.telegramid) !== -1) {
  Bot.sendMessage("⛔ <b>Access Denied:</b> You have been banned by the administrator from using this bot.", { parse_mode: "html" });
  return;
}

// 1. Fetch bot's username automatically if not stored yet
var botUsername = Bot.getProperty("bot_username");
if (!botUsername) {
  Api.getMe({ on_result: "/onGetMe" });
}

// 2. Track registered user in bot user database
var userList = Bot.getProperty("user_list") || [];
if (userList.indexOf(user.telegramid) === -1) {
  userList.push(user.telegramid);
  Bot.setProperty("user_list", userList, "json");
}

// 3. Auto-claim admin if no admin is configured yet
var adminId = Bot.getProperty("admin_id");
if (!adminId) {
  Bot.setProperty("admin_id", user.telegramid, "string");
  Bot.sendMessage("👑 <b>Admin Notice:</b> You have been automatically set as the bot Admin! (ID: <code>" + user.telegramid + "</code>)\nUse /admin to open the Admin Panel.", { parse_mode: "html" });
}

// 4. Handle Deep Linking (When user clicks a file link: /start FS_XXXX)
var fileCode = params;
if (fileCode) {
  fileCode = fileCode.trim();
  
  // Check Force Subscribe Channels (Public, Private, or Request)
  var channels = Bot.getProperty("fsub_channels") || [];
  if (channels.length === 0) {
    var singleCh = Bot.getProperty("fsub_channel");
    if (singleCh) {
      channels = [{ id: singleCh, link: (singleCh.indexOf("@") === 0 ? ("https://t.me/" + singleCh.replace("@", "")) : ("https://t.me/" + singleCh)), type: "public", title: singleCh }];
    }
  }

  if (channels.length > 0) {
    // Store requested file in user session
    User.setProperty("requested_file", fileCode, "string");
    User.setProperty("fsub_checking_index", 0, "integer");
    
    // Check first channel membership via Telegram Bot API
    Api.getChatMember({
      chat_id: channels[0].id,
      user_id: user.telegramid,
      on_result: "/checkJoin"
    });
    return;
  }
  
  // If FSUB is disabled, retrieve the file directly
  Bot.runCommand("/getFile " + fileCode);
  return;
}

// 5. Default Welcome Screen (When no file code is provided)
var firstName = user.first_name || "Friend";
var welcomeText = "👋 <b>Welcome, " + firstName + "!</b>\n\n" +
  "🚀 <b>Welcome to the Premium File Sharing Bot!</b>\n" +
  "I can store your files securely on Telegram and generate fast, permanent sharing links.\n\n" +
  "📌 <b>Features:</b>\n" +
  "• Supports Documents, Videos, Audios, Photos & APKs\n" +
  "• Direct permanent shareable deep links\n" +
  "• Multi-Channel Force Subscribe (Public, Private & Request Channels)\n" +
  "• Real-time Download Traffic Tracker & Button Locker\n\n" +
  "👇 <i>Choose an option below to get started:</i>";

var lockedButtons = Bot.getProperty("locked_buttons") || {};
var buttons = [];

var uploadText = lockedButtons.upload ? "🔒 Upload Info [Locked]" : "📤 Upload Info";
var statsText = lockedButtons.stats ? "🔒 Bot Stats [Locked]" : "📊 Bot Stats";
var helpText = lockedButtons.help ? "🔒 Help [Locked]" : "ℹ️ Help & Commands";

buttons.push([
  { text: uploadText, callback_data: "/upload_info", style: "primary" },
  { text: statsText, callback_data: "/stats", style: "primary" }
]);

buttons.push([
  { text: helpText, callback_data: "/help", style: "primary" },
  { text: "👑 Admin Panel", callback_data: "/admin", style: "success" }
]);

Api.sendMessage({
  chat_id: chat.chatid,
  text: welcomeText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
