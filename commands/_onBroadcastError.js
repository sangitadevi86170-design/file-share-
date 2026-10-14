/*CMD
  command: /onBroadcastError
  help: Callback when Telegram fails to deliver a broadcast message to a user
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var stats = Bot.getProperty("broadcast_stats") || {};
stats.failed = (stats.failed || 0) + 1;
if (stats.dispatched && stats.dispatched > 0) {
  stats.delivered = Math.max(0, stats.dispatched - stats.failed);
}
Bot.setProperty("broadcast_stats", stats, "json");
