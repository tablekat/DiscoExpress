
module.exports = function(bot, msg, next){

  var reg = /^!help/;
  var res = reg.exec(msg.content);

  if(res){
    bot.reply(msg, "Hi i'm a bot!");
    return;
  }else{
    next();
  }

}
