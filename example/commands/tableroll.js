

module.exports = function(db){ // Pretend this needs db

  return function(bot, msg, next){

    var regRoll = /^!roll (\d+)\s*$/;
    var resRoll = regRoll.exec(msg.content);
    if(resRoll){

      if(typeof(resRoll[1]) !== "undefined"){
        var randRes = 1 + Math.floor(Math.random() * resRoll[1]);
        bot.reply(msg, "Random from 1 to " + (1 * resRoll[1]) + ": " + randRes);
      }

      return;
    }else{
      next();
    }
  }
}
