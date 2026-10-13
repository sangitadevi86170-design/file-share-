/*CMD
  command: /start
  help: Start the bot, send persistent reply keyboard, or handle deep links
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 🔙 Main Menu, Main Menu
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

// 3. Configure Admin ID (Set to 8710308658)
var adminId = "8710308658";
Bot.setProperty("admin_id", adminId, "string");

// 4. Handle Deep Linking (When user clicks a file link: /start <file_code_or_file_id>)
var fileCode = params;
if (fileCode) {
  fileCode = fileCode.trim();
  if (fileCode.indexOf("start=") === 0) {
    fileCode = fileCode.replace("start=", "").trim();
  }
  
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

// 5. Default Welcome Screen with Reply Keyboard
var firstName = user.first_name || "Friend";
var welcomeText = "👋 <b>Welcome, " + firstName + "!</b>\n\n" +
  "🚀 <b>Welcome to File Share Bot!</b>\n" +
  "You can upload, store, and share any file on Telegram with permanent download links.\n\n" +
  "📌 <b>Features:</b>\n" +
  "• Upload any Document, Video, Audio, or Photo\n" +
  "• Direct permanent shareable download links\n" +
  "• Live download tracking (see who downloaded your files)\n" +
  "• Rename, edit captions, or delete your files anytime\n\n" +
  "👇 <i>Use the menu buttons below to navigate:</i>";

var replyKeyboard = [
  [
    { text: "📁 My Files" },
    { text: "📤 Upload File" }
  ],
  [
    { text: "📊 My Traffic" },
    { text: "ℹ️ Help" }
  ]
];

// Add Admin Panel button if caller is admin
if (user.telegramid == adminId) {
  replyKeyboard.push([
    { text: "👑 Admin Panel" }
  ]);
}

Api.sendMessage({
  chat_id: chat.chatid,
  text: welcomeText,
  parse_mode: "html",
  reply_markup: {
    keyboard: replyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
