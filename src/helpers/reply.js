
module.exports = function(message, useSendMessage){


  return function(bot, msg, next){

    if(useSendMessage){
      if(typeof message === "function"){
        bot.sendMessage(msg.channel, message(msg, bot));
      }else{
        bot.sendMessage(msg.channel, message);
      }
    }else{
      if(typeof message === "function"){
        bot.reply(msg, message(msg, bot));
      }else{
        bot.reply(msg, message);
      }
    }

    return true; // Tell the router to let us handle calling next ourselves (which we won't do, so all routes are completely finished.)

  }
}
