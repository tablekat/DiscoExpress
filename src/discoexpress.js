
var Discord = require("../node_modules/discord.js");
var Route = require('./Route');

function DiscoExpress(){

  this.bot = new Discord.Client();
  this.routes = {};
  this.loggedIn = false;

}

DiscoExpress.prototype.on = function(event, handler){
  if(!this.routes[event]){
    this.routes[event] = new Route();
    this.listenToEvent(event, this.routes[event]);
  }
  this.routes[event].route(handler);
}

DiscoExpress.prototype.listenToEvent = function(event, route){
  var bot = this.bot;
  this.bot.on(event, function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(bot);
    route.receive.apply(route, args);
  });
}

DiscoExpress.prototype.login = function(email, password, next){
  if(typeof password == "function" || !password){
    var token = email;
    next = password || function(){};
    this.bot.loginWithToken(token, null, null, next);
  }else{
    this.bot.login(email, password, next);
  }
}



module.exports = DiscoExpress;
