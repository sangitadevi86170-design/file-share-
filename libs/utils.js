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

function formatDateTime(d) {
  var date = d || new Date();
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var day = date.getDate();
  var month = months[date.getMonth()];
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  var strTime = (hours < 10 ? "0" + hours : hours) + ":" + 
                (minutes < 10 ? "0" + minutes : minutes) + ":" + 
                (seconds < 10 ? "0" + seconds : seconds) + " " + ampm;
  return day + " " + month + " " + year + ", " + strTime;
}

publish({
  formatSize: formatSize,
  generateCode: generateCode,
  formatDateTime: formatDateTime
});
