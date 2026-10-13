/*CMD
  command: /verifyJoin
  help: Retry verification for Force Subscribe
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var fsubChannel = Bot.getProperty("fsub_channel");
var requestedFile = User.getProperty("requested_file");

if (!fsubChannel) {
  if (requestedFile) {
    Bot.runCommand("/getFile " + requestedFile);
  } else {
    Bot.sendMessage("ℹ️ No pending file request. Send /start to browse the bot.");
  }
  return;
}

// Re-check channel membership
Api.getChatMember({
  chat_id: fsubChannel,
  user_id: user.telegramid,
  on_result: "/checkJoin"
});
