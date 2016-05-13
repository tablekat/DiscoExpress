
var Discord = require("discord.js");
var Route = require('./Route');

/**
 * DiscoExpress wrapper client for discord.js
 * @constructor
 */
function DiscoExpress(){

  this.bot = new Discord.Client();
  this.routes = {};
  this.loggedIn = false;

}

/**
 * Provide a handler to an event.
 * @param {string} event - The event string accepted by discord.js's Client.on method.
 * @param {...(handlerNextCallback|Route)} handler(s) - Handlers to add. Can be functions of type (bot, ...args, next) or Route objects
 */
DiscoExpress.prototype.on = function(event, handler/*, ... handlers*/){
  if(!this.routes[event]){
    this.routes[event] = new Route();
    this.listenToEvent(event, this.routes[event]);
  }

  if(arguments.length <= 2){
    this.routes[event].route(handler);
  }else{
    var handlerRoute = new Route();
    for(var i = 1; i < arguments.length; ++i){
      handlerRoute.route(arguments[i]);
    }
    this.routes[event].route(handlerRoute);
  }

  return this;
}

/**
 * When adding handlers for a new event type, begin listening to that event on the discord.js client.
 * @private
 * @param {string} event - The event string accepted by discord.js's Client.on method.
 * @param {Route} route - The root Route object to receive this event.
 */
DiscoExpress.prototype.listenToEvent = function(event, route){
  var bot = this.bot;
  this.bot.on(event, function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(bot);
    args.push(function(){});
    route.receive.apply(route, args);
  });
}

/**
 * Login to Disord via an email/password or a token.
 * @private
 * @param {string} email|token - E-mail if a password is provided, or a token if no password is provided
 * @param {string} [password] - Optional password. If password is set and is a string, will attempt to log in with email/password combination
 * @param {function} [next] - Callback with error and token from discord.js
 */
DiscoExpress.prototype.login = function(email, password, next){
  if(typeof password == "function" || !password){
    var token = email;
    next = password || function(){};
    this.bot.loginWithToken(token, null, null, next);
  }else{
    this.bot.login(email, password, next);
  }

  return this;
}



module.exports = DiscoExpress;
