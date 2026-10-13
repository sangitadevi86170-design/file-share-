/*CMD
  command: /verifyJoin
  help: Retry verification for all Force Subscribe channels
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var channels = Bot.getProperty("fsub_channels") || [];
if (channels.length === 0) {
  var singleCh = Bot.getProperty("fsub_channel");
  if (singleCh) {
    channels = [{ id: singleCh, link: (singleCh.indexOf("@") === 0 ? ("https://t.me/" + singleCh.replace("@", "")) : ("https://t.me/" + singleCh)), type: "public", title: singleCh }];
  }
}

var requestedFile = User.getProperty("requested_file");

if (channels.length === 0) {
  if (requestedFile) {
    Bot.runCommand("/getFile " + requestedFile);
  } else {
    Bot.sendMessage("ℹ️ No pending file request. Send /start to browse the bot.");
  }
  return;
}

// Reset checking index to 0 and check first channel
User.setProperty("fsub_checking_index", 0, "integer");
var firstCh = channels[0];

Api.getChatMember({
  chat_id: firstCh.id,
  user_id: user.telegramid,
  on_result: "/checkJoin"
});
