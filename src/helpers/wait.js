

module.exports = function(ms){
  return function(bot, msg, next){

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });

  }
}
