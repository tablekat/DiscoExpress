

module.exports = function(ms){
  return function(bot, msg, next){

    setTimeout(() => {
      next();
    }, ms);

  }
}
