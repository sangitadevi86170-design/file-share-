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
  
  // Check if Force Subscription (FSUB) is enabled
  var fsubChannel = Bot.getProperty("fsub_channel");
  if (fsubChannel) {
    // Store requested file in user session
    User.setProperty("requested_file", fileCode, "string");
    
    // Check channel membership via Telegram Bot API
    Api.getChatMember({
      chat_id: fsubChannel,
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
  "• Force Subscribe (FSUB) Channel protection\n" +
  "• Built-in Admin Broadcast & Analytics\n\n" +
  "👇 <i>Choose an option below to get started:</i>";

var buttons = [
  [
    { text: "📤 Upload Info", callback_data: "/upload_info" },
    { text: "📊 Bot Stats", callback_data: "/stats" }
  ],
  [
    { text: "ℹ️ Help & Commands", callback_data: "/help" },
    { text: "👑 Admin Panel", callback_data: "/admin" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: welcomeText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
