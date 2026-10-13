/*CMD
  command: /onGetMe
  help: Callback to save bot username
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

if (options && options.result && options.result.username) {
  Bot.setProperty("bot_username", options.result.username, "string");
}
