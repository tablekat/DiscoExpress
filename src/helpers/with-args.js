

module.exports = function(func, splitBy){
  return function(bot, msg, next){

    var args = msg.content.split(splitBy || ' ');

    return func(args, bot, msg, next);

  }
}
