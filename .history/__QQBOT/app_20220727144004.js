
const { createClient } = require("oicq")
const account = require("../manifest").QUID
const client = createClient(account)
const API = require("../__API/entrance");
const fs = require("fs");
var admin_list = "";
var group_list = "";
var adminUpdater = function() {fs.readFile("./__QQBOT/admin-list.txt",function(err, data){ 
  if(err) return;
  console.log("admin_list 已更新")
  admin_list = data.toString()
})}
var groupUpdater = function() {fs.readFile("./__QQBOT/controlled-group.txt",function(err, data){ 
  if(err) return;
  console.log("group_list 已更新")
  group_list = data.toString()
})}
setInterval(adminUpdater,1000 * 30);setInterval(groupUpdater,1000 * 30);
adminUpdater();groupUpdater();

client.on("system.online", () => console.log("Logged in!"))
client.on("message.group", e => {
  //合法性检查
  if (e.message_type != "group") return;
  if (e.message[0].type != "text") return;
  if (e.sub_type != 'normal') return;
  if (e.post_type != 'message') return;
  if (e.block == true) return;
  if (e.atall == true) return;
  if (!group_list.match(e.group_id.toString())) return;

  if (console.log(e.raw_message != e.message[0].text)) {e.reply("您的消息存在编码错误", true); return;}
  if (e.raw_message.split("")[0] != "!") return;
  let spacing = e.raw_message.indexOf(" ");

  if(spacing == -1) {
    //不传递参数
    switch(e.raw_message) {
      case "!allconfigs" :
        API("GET", "configs").then(function(result) {
          for（
          e.reply(JSON.parse(result).configs[0].config_id.toString(), true)
        })
      break;
      case "!世界上谁最帅" :
        e.reply("冯俊祥世界第一帅！", true)
      break;
      default:
        e.reply("此指令不存在 输入 !help 获得帮助", true);
      break;
    }
  }
})

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()

module.exports = client;