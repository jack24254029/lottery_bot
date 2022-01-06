/**
 * 透過 random 產出隨機一個數字
 * Ref: https://api.random.org/json-rpc/4/basic
 */
function randomNumber() {
  const response = UrlFetchApp.fetch('https://api.random.org/json-rpc/4/invoke', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    'method': 'post',
    'payload': JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'generateIntegers',
      'params': {
        'apiKey': RANDOM_API_KEY,
        'n': 1,
        'min': 1,
        'max': 9999,
        'replacement': false
      },
      'id': 42
    }),
  });
  const result = JSON.parse(response.getContentText());
  return result.result.random.data[0];
}

/**
 * Fisher-Yates Shuffle
 * Ref: https://shubo.io/javascript-random-shuffle/
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function log(msg) {
  const spreadSheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadSheet.getSheetByName('Log');
  const now = new Date();
  sheet.insertRowAfter(1);
  sheet.getRange(2, 1).setValue(Utilities.formatDate(now, 'GMT+8', "yyyy/MM/dd HH:mm:ss.SSS"));
  sheet.getRange(2, 2).setValue(msg);
}