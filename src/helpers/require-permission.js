
module.exports = function(permission){


  return function(bot, msg, next){
    if(!msg.channel.server) return next(false);

    var userRoles = msg.channel.server.rolesOfUser(msg.author);

    for(var i = 0; i < userRoles.length; ++i){
      if(userRoles[i].hasPermission(permission)){
        return next(); // User has permission
      }
    }

    // Failed to find permission on user. Break this route branch.
    return next(false);

  }
}
