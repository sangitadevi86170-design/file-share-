/*LIB
  name: utils
  help: Utility helper functions for File Share Bot
LIB*/

function formatSize(bytes) {
  if (!bytes || bytes === 0) {
    return "Unknown Size";
  }
  if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(2) + " MB";
  }
  return (bytes / 1024).toFixed(2) + " KB";
}

function generateCode(prefix) {
  var p = prefix || "FS_";
  var r1 = Math.random().toString(36).substring(2, 7).toUpperCase();
  var r2 = (new Date().getTime() % 10000).toString(36).toUpperCase();
  return p + r1 + r2;
}

publish({
  formatSize: formatSize,
  generateCode: generateCode
});
