/*CMD
  command: /sentRequest
  help: Mark join request as sent for Request Channels
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var channels = Bot.getProperty("fsub_channels") || [];
for (var i = 0; i < channels.length; i++) {
  if (channels[i].type === "request") {
    User.setProperty("has_requested_" + channels[i].id, true, "boolean");
  }
}

Bot.sendMessage("✅ <b>Join Request Recorded!</b> Now verifying your membership...", { parse_mode: "html" });
Bot.runCommand("/verifyJoin");
