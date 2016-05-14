
module.exports = function(matcher){


  return function(bot, msg, next){

    if(matcher instanceof RegExp){
      if(matcher.exec(msg.content)){
        // test passed, continue down this branch
        return;
      }
    }else{
      if(matcher == msg.content){
        // test passed, continue down this branch
        return;
      }
    }

    // Failed to find permission on user. Break this route branch.
    return false;

  }
}
