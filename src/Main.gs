const replayUrl = 'https://api.line.me/v2/bot/message/reply';
var replyMessage = '';

/**
 * 主程式進入點
 * 
 * 指令
 * 加入獎項至 Google Sheets
 * /add [item1] [item2] [item3] ...
 * 登記
 * /want [who] [item1] [item2] [item3] ...
 * 各個 item 報名情況
 * /list
 * 抽獎
 * /lottery [item1] [count]
 * 指令說明
 * /help
 */

function doPost(e) {
  log(e.postData.contents);
  const msg = JSON.parse(e.postData.contents);
  const type = msg.events[0].message.type;
  if (type != 'text') {
    return;
  }
  const source = msg.events[0].source.type;
  if (source != 'group') {
    return;
  }
  const groupId = msg.events[0].source.groupId;
  if (groupId != TARGET_GROUP_ID) {
    return;
  }
  const replyToken = msg.events[0].replyToken;
  const userMessage = msg.events[0].message.text;
  if (typeof replyToken === 'undefined') {
    return;
  }
  log(e.postData.contents);
  console.log(e.postData.contents);
  if (userMessage.startsWith('/add ')) {
    const params = userMessage.split(' ');
    addProcess(params);
  } else if (userMessage.startsWith('/want ')) {
    const params = userMessage.split(' ');
    try {
      wantProcess(params);
    } catch (e) {
      log(e.stack);
    }
  } else if (userMessage.startsWith('/list')) {
    listProcess();
  } else if (userMessage.startsWith('/lottery ')) {
    const params = userMessage.split(' ');
    lotteryProcess(params);
  } else if (userMessage.startsWith('/help')) {
    helpProcess();
  }
  if (replyMessage.length === 0) {
    return;
  }
  sendMessage(replyToken, replyMessage);
}

/**
 * /add 邏輯處理
 */
function addProcess(params) {
  createSheet();
  const sheet = getSheet();
  const items = params.slice(1).filter(function (value, index, array) { return value != '' });
  replyMessage = '已加入獎項：\n';
  for (var i = 0; i < items.length; i++) {
    const item = items[i];
    sheet.getRange(1, (i + 2)).setValue(item);
    replyMessage += '- ' + item + '\n';
  }
}

/**
 * /want 邏輯處理
 */
function wantProcess(params) {
  const lock = LockService.getScriptLock();
  const uuid = Utilities.getUuid();
  log(uuid + ' : ' + params);
  const who = params[1];
  const items = params.slice(2).filter(function (value, index, array) { return value != '' });
  const sheet = getSheet();
  if (who.length == 0) {
    replyMessage = '請檢查有沒有輸入名字';
    return;
  }
  var find = sheet.createTextFinder(who).findAll();
  for (var i = 0; i < find.length; i++) {
    const target = find[i];
    if (target.getRowIndex() == 1) {
      replyMessage = '請檢查有沒有輸入名字';
      return;
    }
  }
  try {
    lock.waitLock(5000);
    const count = getRowCountOfColumn(0);
    sheet.getRange(count + 2, 1).setValue(uuid);
    SpreadsheetApp.flush();
    lock.releaseLock();
  } catch (e) {
    log('First wait lock exception:\n' + e.stack);
    Utilities.sleep(1000);
    // Try again
    try {
      lock.waitLock(5000);
      const count = getRowCountOfColumn(0);
      sheet.getRange(count + 2, 1).setValue(uuid);
      SpreadsheetApp.flush();
      lock.releaseLock();
    } catch (error) {
      lock.releaseLock();
      log('Second wait lock exception:\n' + error.stack);
      throw error;
    }
  }
  const rowIndex = sheet.createTextFinder(uuid).findNext().getRowIndex();
  replyMessage = who + '已完成登記以下獎項：\n';
  for (var i = 0; i < items.length; i++) {
    const columnIndex = getColumnIndex(items[i]);
    if (columnIndex == -1) {
      continue;
    }
    replyMessage += '- ' + items[i] + '\n';
    sheet.getRange(rowIndex, columnIndex + 1).setValue(who);
  }
  find = sheet.createTextFinder(who).findAll();
  for (var i = 0; i < find.length; i++) {
    const target = find[i];
    if (target.getRowIndex() != rowIndex) {
      target.setValue('');
    }
  }
}

/**
 * /list 邏輯處理
 */
function listProcess() {
  const data = getDataRangeValues();
  const columnCount = data[0].length;
  replyMessage = '登記狀況\n';
  for (var i = 1; i < columnCount; i++) {
    replyMessage += '- ' + data[0][i] + '：\n  ';
    for (var j = 1; j < data.length; j++) {
      if (data[j][i].toString().length == 0) {
        continue;
      }
      replyMessage += data[j][i] + ' ';
    }
    replyMessage += '\n';
  }
}

/**
 * /lottery 邏輯處理
 */
function lotteryProcess(params) {
  if (params.length != 3) {
    replyMessage = '參數錯誤';
    return;
  }
  const item = params.slice(1, 2)[0];
  var count = params.slice(2, 3)[0];
  if (count.length == 0) {
    replyMessage = '請檢查有沒有輸入要抽幾個';
    return;
  }
  if (count == 0) {
    replyMessage = '抽的數量要大於0';
    return;
  }
  const columnIndex = getColumnIndex(item);
  var list = getListOfColumn(columnIndex); // raw data
  replyMessage = '！！恭喜！！\n';
  replyMessage += item + '得獎者：\n';
  log('原名單:' + list);
  console.log('原名單:' + list);
  for (var i = 0; i < count; i++) {
    if (list.length == 0) {
      replyMessage += '- 從缺\n';
      continue;
    }
    shuffle(list);
    log('Round ' + (i + 1) + ' 亂數名單 ' + list);
    console.log('Round ' + (i + 1) + ' 亂數名單 ' + list);
    const seed = randomNumber();
    const index = seed % list.length;
    log('亂數 index = ' + seed + '/' + list.length + ' 取餘數 = ' + index);
    console.log('亂數 index = ' + seed + '/' + list.length + ' 取餘數 = ' + index);
    const who = list[index];
    log('Round ' + (i + 1) + ' 中籤者：' + who);
    console.log('Round ' + (i + 1) + ' 中籤者：' + who);
    replyMessage += '- ' + who + '\n';
    list = list.filter(function (value, index, array) { return value != who });
  }
}

/**
 * /help 邏輯處理
 */
function helpProcess() {
  replyMessage = '- 加入獎項\n' +
    '/add [item1] [item2] [item3] ...\n\n' +
    '- 登記\n' +
    '/want [who] [item1] [item2] [item3] ...\n\n' +
    '- 各個 item 報名情況\n' +
    '/list\n\n' +
    '- 抽獎\n' +
    '/lottery [item1] [count]\n\n' +
    '- 指令說明\n' +
    '/help';
}

/**
 * 發訊息到 Line
 */
function sendMessage(token, message) {
  UrlFetchApp.fetch(replayUrl, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': token,
      'messages': [{
        'type': 'text',
        'text': message,
      }],
    }),
  });
}
