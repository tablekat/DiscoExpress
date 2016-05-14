module.exports = function(roles){

  if(!Array.isArray(roles)) roles = [roles];

  return function(bot, msg, next){
    if(!msg.channel.server) return next(false);

    var userRoles = msg.channel.server.rolesOfUser(msg.author);

    for(var i = 0; i < userRoles.length; ++i){
      for(var j = 0; j < roles.length; ++j){
        var role = roles[j];
        if(typeof role === "string"){
          if(role == userRoles[i].name) return; // User has role (by string)
        }else if(role.id){
          if(role.id == userRoles[i].id) return; // User has role (by id match)
        }
      }
    }

    // Failed to find role on user. Break this route branch.
    return false;

  }
}
