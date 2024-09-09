const sheetName = Utilities.formatDate(new Date(), 'GMT+8', "yyyy/MM/dd");
const activeSheetApp = SpreadsheetApp.openById(SHEET_ID);

function getSheetName() {
  return sheetName;
}

function getSheet() {
  return activeSheetApp.getSheetByName(getSheetName());
}

function getDataRangeValues() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  return data;
}

/**
 * 取得標題欄的 index
 */
function getColumnIndex(item) {
  const data = getDataRangeValues();
  if (data.length == 0) {
    return -1;
  }
  return data[0].indexOf(item);
}

/**
 * 取得某欄有幾列，不含第一列，第一列是標題欄
 */
function getRowCountOfColumn(columnIndex) {
  const data = getDataRangeValues();
  var count = 0; // 不含第一列
  for (var i = 1; i < data.length; i++) {
    if (data[i][columnIndex].length == 0) {
      continue;
    }
    count += 1;
  }
  return count;
}

/**
 * 取得某人在某欄的 index
 */
function getRowIndex(columnIndex, who) {
  const data = getDataRangeValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][columnIndex] === who) {
      return i
    }
  }
  return 0;
}

/**
 * 重設某人的每一欄登記狀況
 */
function resetRegister(who) {
  const sheet = getSheet();
  const textFinder = sheet.createTextFinder(who);
  const target = textFinder.findAll();
  for (var i = 0; i < target.length; i++) {
    target[i].setValue('');
  }
}

/**
 * 取得某攔的登記列表
 */
function getListOfColumn(columnIndex) {
  const data = getDataRangeValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    const who = data[i][columnIndex];
    if (who.length == '') {
      continue;
    }
    list.push(who);
  }
  return list;
}

/**
 * 建立工作表，以當日 (yyyy/MM/dd) 為工作表名稱
 */
function createSheet() {
  const sheet = getSheet();
  if (sheet != null) {
    let range = sheet.getDataRange();
    range.clearContent();
    range.clearFormat();
    return;
  }
  const newSheet = activeSheetApp.openById(SHEET_ID).insertSheet();
  newSheet.setName(sheetName);
}
