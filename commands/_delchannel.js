/*CMD
  command: /delchannel
  help: Remove a Force Subscribe channel
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

var channels = Bot.getProperty("fsub_channels") || [];
var param = params ? params.trim() : "";

if (channels.length === 0) {
  Bot.setProperty("fsub_channel", null, "string");
  Bot.sendMessage("ℹ️ No Force Subscribe channels are currently configured.", { parse_mode: "html" });
  return;
}

if (!param) {
  // If no param, clear all channels
  Bot.setProperty("fsub_channels", [], "json");
  Bot.setProperty("fsub_channel", null, "string");
  Bot.sendMessage("✅ <b>All Force Subscribe channels have been removed!</b>\nUsers can now download files without any channel lock.", { parse_mode: "html" });
  return;
}

var idx = parseInt(param);
if (!isNaN(idx)) {
  if (idx > 0 && idx <= channels.length) {
    idx = idx - 1;
  }
  if (idx >= 0 && idx < channels.length) {
    var removed = channels.splice(idx, 1)[0];
    Bot.setProperty("fsub_channels", channels, "json");
    Bot.setProperty("fsub_channel", channels.length > 0 ? channels[0].id : null, "string");
    Bot.sendMessage("✅ <b>Removed Channel:</b> " + (removed.title || removed.id), { parse_mode: "html" });
    Bot.runCommand("/fsubchannels");
    return;
  }
}

// Match by ID
var filtered = [];
var found = false;
for (var i = 0; i < channels.length; i++) {
  if (channels[i].id === param) {
    found = true;
  } else {
    filtered.push(channels[i]);
  }
}

if (found) {
  Bot.setProperty("fsub_channels", filtered, "json");
  Bot.setProperty("fsub_channel", filtered.length > 0 ? filtered[0].id : null, "string");
  Bot.sendMessage("✅ <b>Channel Removed:</b> <code>" + param + "</code>", { parse_mode: "html" });
  Bot.runCommand("/fsubchannels");
} else {
  Bot.sendMessage("⚠️ Channel not found in active list.", { parse_mode: "html" });
}
