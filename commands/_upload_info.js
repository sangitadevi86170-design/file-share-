/*CMD
  command: /upload_info
  help: Information and guide on how to upload files
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 📤 Upload File, Upload File
  group: 
CMD*/

var publicUpload = Bot.getProperty("public_upload");
var adminId = Bot.getProperty("admin_id") || "8710308658";
var isUserAdmin = (user.telegramid == adminId);
var locked = Bot.getProperty("locked_buttons") || {};

if (locked.upload && !isUserAdmin) {
  Bot.sendMessage("🔒 <b>Uploads Locked:</b> File uploads are currently locked by the administrator.", { parse_mode: "html" });
  return;
}

var infoText = "📤 <b>HOW TO UPLOAD & SHARE FILES:</b>\n\n" +
  "1️⃣ Simply <b>send or forward</b> any file directly to this bot:\n" +
  "   • 📁 Documents (PDF, ZIP, APK, RAR, TXT, etc.)\n" +
  "   • 🎥 Videos (MP4, MKV, AVI, etc.)\n" +
  "   • 🎵 Audio & Songs (MP3, WAV, etc.)\n" +
  "   • 🖼️ Photos & Images (PNG, JPG)\n\n" +
  "2️⃣ The bot will instantly generate a <b>permanent shareable link</b>!\n\n" +
  "3️⃣ Copy the link and share it anywhere. Anyone clicking it will receive the file instantly.\n\n" +
  "4️⃣ You can rename your files, change captions, or view who downloaded your files anytime in <b>📁 My Files</b>!";

var buttons = [
  [{ text: "📁 Open My Files", callback_data: "/myfiles", style: "primary" }],
  [{ text: "🔙 Back to Home", callback_data: "/start", style: "primary" }]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: infoText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
