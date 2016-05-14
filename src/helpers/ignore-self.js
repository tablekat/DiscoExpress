

module.exports = function(bot, msg, next){

  if(msg.sender.id == bot.user.id){
    return false;
  }else{
    return;
  }

}
