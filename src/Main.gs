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
  if (userMessage.startsWith('/') == false) {
    return;
  }
  log(e.postData.contents);
  console.log(e.postData.contents);

  let replyMessage = ""
  try { 
    // command routing
    replyMessage = routing.apply(this, userMessage.split(' '))
  } catch(e) {
    // command not handled
  }

  if (replyMessage.length === 0) {
    return;
  }
  sendMessage(replyToken, replyMessage);
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
