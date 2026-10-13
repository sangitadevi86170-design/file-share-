/*CMD
  command: /buttonlock
  help: Lock or unlock specific bot buttons and features
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /locker
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id");
if (user.telegramid != adminId) {
  Bot.sendMessage("⛔ <b>Access Denied: Admin only!</b>", { parse_mode: "html" });
  return;
}

var locked = Bot.getProperty("locked_buttons") || {};
var toggleKey = params ? params.trim().toLowerCase() : "";

// If a toggle action was clicked
if (toggleKey) {
  locked[toggleKey] = !locked[toggleKey];
  Bot.setProperty("locked_buttons", locked, "json");
  Bot.sendMessage("🔄 <b>Updated Button Lock for:</b> <code>" + toggleKey.toUpperCase() + "</code> (Now " + (locked[toggleKey] ? "🔴 LOCKED" : "🟢 UNLOCKED") + ")", { parse_mode: "html" });
}

// Display current status of all button locks
var uploadStatus = locked.upload ? "🔴 LOCKED" : "🟢 UNLOCKED";
var downloadStatus = locked.download ? "🔴 LOCKED" : "🟢 UNLOCKED";
var statsStatus = locked.stats ? "🔴 LOCKED" : "🟢 UNLOCKED";
var helpStatus = locked.help ? "🔴 LOCKED" : "🟢 UNLOCKED";
var aboutStatus = locked.about ? "🔴 LOCKED" : "🟢 UNLOCKED";

var text = "🔐 <b>BUTTON LOCKER CONTROL PANEL</b>\n\n" +
  "Control which buttons and features are accessible to regular users:\n\n" +
  "• 📤 <b>Upload Button:</b> " + uploadStatus + "\n" +
  "• 📥 <b>File Downloads:</b> " + downloadStatus + "\n" +
  "• 📊 <b>Bot Stats Button:</b> " + statsStatus + "\n" +
  "• ℹ️ <b>Help Button:</b> " + helpStatus + "\n" +
  "• 🤖 <b>About Button:</b> " + aboutStatus + "\n\n" +
  "👇 <i>Tap a button below to lock or unlock:</i>";

var buttons = [
  [
    { text: (locked.upload ? "🔓 Unlock Upload" : "🔒 Lock Upload"), callback_data: "/buttonlock upload" },
    { text: (locked.download ? "🔓 Unlock Download" : "🔒 Lock Download"), callback_data: "/buttonlock download" }
  ],
  [
    { text: (locked.stats ? "🔓 Unlock Stats" : "🔒 Lock Stats"), callback_data: "/buttonlock stats" },
    { text: (locked.help ? "🔓 Unlock Help" : "🔒 Lock Help"), callback_data: "/buttonlock help" }
  ],
  [
    { text: (locked.about ? "🔓 Unlock About" : "🔒 Lock About"), callback_data: "/buttonlock about" }
  ],
  [
    { text: "🔙 Back to Admin", callback_data: "/admin" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: { inline_keyboard: buttons }
});
