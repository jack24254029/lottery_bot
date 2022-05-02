/**
 * 透過 random 產出隨機 N 個數字
 * Ref: https://api.random.org/json-rpc/4/basic
 */
function getRandomNumbers(round) {
  var requests = [];
  var numbers = [];
  const request = {
    'url': 'https://api.random.org/json-rpc/4/invoke',
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

    })
  };
  for (var i = 0; i < round; i++) {
    requests.push(request);
  }
  let responses = UrlFetchApp.fetchAll(requests);
  for (var i = 0; i < round; i++) {
    let response = responses[i];
    let result = JSON.parse(response.getContentText());
    numbers.push(result.result.random.data[0]);
  }
  return numbers;
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