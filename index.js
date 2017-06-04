var time = require('time');
var linebot = require('linebot');
var express = require('express');
var getJSON = require('get-json');

var api_basic = 'http://zcash.flypool.org/api/miner_new/';
var table = {"users":{}};

var bot = linebot({
  channelId: "1518261464",
  channelSecret: "d629f1aed2013c113383d5fb42a90707",
  channelAccessToken: "HQG7JamlwUynuUqynTh7mWBRoBLrLx/+RjQoriGD4FMhpexOEXQ3QV2n1iDgY0XqSmne96+U3xhC2vo+wz6tadNPNQSnkrSH6X7cTGD7s2zDQ/QFmXeAzS7hS1IruN5J437X6IeuIaWbApSNLsZ/hQdB04t89/1O/w1cDnyilFU="
});

_bot();

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

function _bot(){
  bot.on('message', function(event) {
    var user_id = event.source.userId;
    if (event.message.type = 'text') {
      var msg = event.message.text;
      var msg_array = msg.split(" ");
      console.log(msg_array);
      switch (msg_array[0]) {
        // Show pool status
        case 'dashboard':
          try{
            var account = table.users[user_id]['zec'];
            dashboard(event, account);
          }catch(err){
            _reply_msg(event, 'Unable to find pool address', 'Unable to find pool address for : ' + user_id);
            console.log(err.message);
          }

          break;
        // Add user pool
        case 'addpool':
          table.users[user_id] = {};
          table.users[user_id][msg_array[1].toLowerCase()] = msg_array[2];
          console.log(table);
          break;

        // case 2:
        //   day = "Tuesday";
        //   break;

        default:
          _reply_msg(event, '???', "Unable to process message : " + msg);
      }
    }
  });
}

function dashboard(event, account){
  _getJSON(account, function(reply_msg){
    _reply_msg(event, reply_msg, "Query pool successfully with account : " + account);
  });
}

function _reply_msg(event, reply_msg, log){
  event.reply(reply_msg).then(function(data) {
    // success 
    console.log(log);
  }).catch(function(error) {
    // error 
    console.log('error');
  });
}

function _getJSON(account, callback) {
  var now = time.time();
  var reply_msg = 'Fail to query...';
  getJSON( api_basic + account, function(error, response) {
    reply_msg  = 'Address : ' + response.address;
    reply_msg += '\nTotal hashrate : ' + response.hashRate;
    reply_msg += '\nAVG hashrate : ' + response.avgHashrate + "\n";

    var workers = response.workers;
    for (worker in workers){
      if( now - workers[worker].workerLastSubmitTime < 300 ){
        reply_msg += '\nWorker (' + worker + ") : " + workers[worker].hashrate;
      }
    }

    reply_msg += '\n\nUSD/Day : ' + response.usdPerMin * 1440;
    reply_msg += '\nEth/Day : ' + response.ethPerMin * 1440;
    reply_msg += '\nBtc/Day : ' + response.btcPerMin * 1440;
    callback(reply_msg);
  });
  // timer = setInterval(_getJSON, 1800000); //每半小時抓取一次新資料
}