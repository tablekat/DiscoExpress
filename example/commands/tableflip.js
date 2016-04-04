

module.exports = function(config){ // this command takes config

  return function(bot, msg, next){
    if(msg.content === config.prefix + "flip"){
      bot.reply(msg, (Math.random() < 0.5 ? "Heads." : "Tails."));
      return;
    }else{
      next();
    }
  }

}
