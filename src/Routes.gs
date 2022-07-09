const routes = {};
routes["/want"] = want;
routes["/add"] = add;
routes["/list"] = list;
routes["/lottery"] = lottery;
routes["/help"] = help;

/**
 * /want 邏輯處理
 */
function want(params) {
  const lock = LockService.getScriptLock();
  const uuid = Utilities.getUuid();
  log(uuid + " : " + params);
  const who = params[1];
  const items = params.slice(2).filter(function (value, index, array) {
    return value != "";
  });
  const sheet = getSheet();
  if (who.length == 0) {
    return "請檢查有沒有輸入名字";
  }
  var find = sheet.createTextFinder(who).findAll();
  for (var i = 0; i < find.length; i++) {
    const target = find[i];
    if (target.getRowIndex() == 1 && target.getValue() == who) {
      return "請檢查有沒有輸入名字";
    }
  }
  try {
    lock.waitLock(5000);
    const count = getRowCountOfColumn(0);
    sheet.getRange(count + 2, 1).setValue(uuid);
    SpreadsheetApp.flush();
    lock.releaseLock();
  } catch (e) {
    log("First wait lock exception:\n" + e.stack);
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
      log("Second wait lock exception:\n" + error.stack);
      throw error;
    }
  }
  const rowIndex = sheet.createTextFinder(uuid).findNext().getRowIndex();
  let response = who + "已完成登記以下獎項：\n";
  for (var i = 0; i < items.length; i++) {
    const columnIndex = getColumnIndex(items[i]);
    if (columnIndex == -1) {
      continue;
    }
    response += "- " + items[i] + "\n";
    sheet.getRange(rowIndex, columnIndex + 1).setValue(who);
  }
  find = sheet.createTextFinder(who).findAll();
  for (var i = 0; i < find.length; i++) {
    const target = find[i];
    if (target.getRowIndex() != rowIndex && target.getValue() == who) {
      target.setValue("");
    }
  }
  return response;
}

/**
 * /add 邏輯處理
 */
function add(params) {
  createSheet();
  const sheet = getSheet();
  const items = params.slice(1).filter(function (value, index, array) {
    return value != "";
  });
  let response = "已加入獎項：\n";
  for (var i = 0; i < items.length; i++) {
    const item = items[i];
    sheet.getRange(1, i + 2).setValue(item);
    response += "- " + item + "\n";
  }
  return response;
}

/**
 * /list 邏輯處理
 */
function list() {
  const data = getDataRangeValues();
  const columnCount = data[0].length;
  let response = "登記狀況\n";
  for (var i = 1; i < columnCount; i++) {
    response += "- " + data[0][i] + "：\n";
    for (var j = 1; j < data.length; j++) {
      if (data[j][i].toString().length == 0) {
        continue;
      }
      response += data[j][i] + " ";
    }
    response += "\n";
  }
  return response;
}

/**
 * /lottery 邏輯處理
 */
function lottery(params) {
  if (params.length != 3) {
    return "參數錯誤";
  }
  const item = params.slice(1, 2)[0];
  var count = params.slice(2, 3)[0];
  if (count.length == 0) {
    return "請檢查有沒有輸入要抽幾個";
  }
  if (count == 0) {
    return "抽的數量要大於0";
  }
  const columnIndex = getColumnIndex(item);
  var list = getListOfColumn(columnIndex); // raw data
  let randomNumbers = getRandomNumbers(count);
  let response = "！！恭喜！！\n";
  response += item + "得獎者：\n";
  log("原名單:" + list);
  console.log("原名單:" + list);
  for (var i = 0; i < count; i++) {
    if (list.length == 0) {
      response += "- 從缺\n";
      continue;
    }
    shuffle(list);
    log("Round " + (i + 1) + " 亂數名單 " + list);
    console.log("Round " + (i + 1) + " 亂數名單 " + list);
    const seed = randomNumbers[i];
    const index = seed % list.length;
    log("亂數 index = " + seed + "/" + list.length + " 取餘數 = " + index);
    console.log(
      "亂數 index = " + seed + "/" + list.length + " 取餘數 = " + index
    );
    const who = list[index];
    log("Round " + (i + 1) + " 中籤者：" + who);
    console.log("Round " + (i + 1) + " 中籤者：" + who);
    response += "- " + who + "\n";
    list = list.filter(function (value, index, array) {
      return value != who;
    });
  }
  return response;
}

/**
 * /help 邏輯處理
 */
function help() {
  return (
    "- 加入獎項\n" +
    "/add [item1] [item2] [item3] ...\n\n" +
    "- 登記\n" +
    "/want [who] [item1] [item2] [item3] ...\n\n" +
    "- 各個 item 報名情況\n" +
    "/list\n\n" +
    "- 抽獎\n" +
    "/lottery [item1] [count]\n\n" +
    "- 指令說明\n" +
    "/help"
  );
}

function routing(cmd, ...params) {
  return routes[cmd](params);
}