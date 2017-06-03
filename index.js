var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: 1518261464,
  channelSecret: d629f1aed2013c113383d5fb42a90707,
  channelAccessToken: HQG7JamlwUynuUqynTh7mWBRoBLrLx/+RjQoriGD4FMhpexOEXQ3QV2n1iDgY0XqSmne96+U3xhC2vo+wz6tadNPNQSnkrSH6X7cTGD7s2zDQ/QFmXeAzS7hS1IruN5J437X6IeuIaWbApSNLsZ/hQdB04t89/1O/w1cDnyilFU=
});


bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});