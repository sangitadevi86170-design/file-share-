/*CMD
  command: /buttonlock
  help: Lock or unlock specific bot buttons and features
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 🔐 Button Locker, Button Locker, /locker, 🔒 Lock Upload, 🔓 Unlock Upload, 🔒 Lock Download, 🔓 Unlock Download, 🔒 Lock Help, 🔓 Unlock Help
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var locked = Bot.getProperty("locked_buttons") || {};
var p = (params || message || "").toLowerCase();

// If admin clicked back buttons, redirect cleanly
if (p.indexOf("admin") !== -1) {
  Bot.runCommand("/admin");
  return;
}
if (p.indexOf("menu") !== -1 || p.indexOf("main") !== -1) {
  Bot.runCommand("/start");
  return;
}

var toggleKey = "";
if (p.indexOf("upload") !== -1 && (p.indexOf("lock") !== -1 || p.indexOf("unlock") !== -1 || p === "upload")) {
  toggleKey = "upload";
} else if (p.indexOf("download") !== -1 && (p.indexOf("lock") !== -1 || p.indexOf("unlock") !== -1 || p === "download")) {
  toggleKey = "download";
} else if (p.indexOf("help") !== -1 && (p.indexOf("lock") !== -1 || p.indexOf("unlock") !== -1 || p === "help")) {
  toggleKey = "help";
}

// If a toggle action was clicked
if (toggleKey) {
  locked[toggleKey] = !locked[toggleKey];
  Bot.setProperty("locked_buttons", locked, "json");
}

// Display current status of all button locks
var uploadStatus = locked.upload ? "🔴 LOCKED" : "🟢 UNLOCKED";
var downloadStatus = locked.download ? "🔴 LOCKED" : "🟢 UNLOCKED";
var helpStatus = locked.help ? "🔴 LOCKED" : "🟢 UNLOCKED";

var text = "🔐 <b>BUTTON LOCKER CONTROL PANEL</b>\n\n" +
  "Control which buttons and features are accessible to regular users:\n\n" +
  "• 📤 <b>Upload Button:</b> " + uploadStatus + "\n" +
  "• 📥 <b>File Downloads:</b> " + downloadStatus + "\n" +
  "• ℹ️ <b>Help Button:</b> " + helpStatus + "\n\n" +
  "👇 <i>Tap any reply button below to toggle lock/unlock:</i>";

var lockerReplyKeyboard = [
  [
    { text: (locked.upload ? "🔓 Unlock Upload" : "🔒 Lock Upload"), style: (locked.upload ? "success" : "danger") },
    { text: (locked.download ? "🔓 Unlock Download" : "🔒 Lock Download"), style: (locked.download ? "success" : "danger") },
    { text: (locked.help ? "🔓 Unlock Help" : "🔒 Lock Help"), style: (locked.help ? "success" : "danger") }
  ],
  [
    { text: "👑 Admin Panel", style: "primary" },
    { text: "🔙 Main Menu", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: {
    keyboard: lockerReplyKeyboard,
    resize_keyboard: true,
    is_persistent: true
  }
});
