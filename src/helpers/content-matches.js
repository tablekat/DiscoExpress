
module.exports = function(matcher){


  return function(bot, msg, next){

    if(matcher instanceof RegExp){
      if(matcher.exec(msg.content)){
        return next();
      }
    }else{
      if(matcher == msg.content){
        return next();
      }
    }

    // Failed to find permission on user. Break this route branch.
    return next(false);

  }
}
