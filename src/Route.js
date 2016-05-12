
/**
 * A route for a discord.js event
 * @constructor
 */
function Route(){
  this.handlers = [];
}

/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback handlerNextCallback
 * @param {Client} Discord.js Client object for this connection
 * @param {...*} Arguments provided to the discord.js event.
 * @param {function} Callback to continue. Can be passed an error object to stop execution of all routes.
 */

/**
 * Provide a handler to this route.
 * @param {(handlerNextCallback|Route)} - Handler to add. Can be a function of type (bot, ...args, next) or a sub Route object
 */
Route.prototype.route = function(handler){
  if(typeof handler !== "function" && !(handler instanceof Route)){
    throw new Error("Invalid handler");
  }
  this.handlers.push(handler);
}

/**
 * Receive an event from DiscoExpress. Route it through the handlers.
 * @param {Client} Discord.js Client object for this connection
 * @param {...*} Arguments provided by the discord.js event.
 * @param {function} Callback to continue. Can be passed an error object to stop execution of all routes.
 */
Route.prototype.receive = function(/*bot, ...handlerArgs, next*/){
  var bot = arguments[0];
  var next = arguments[arguments.length - 1];
  var handlerArgs = Array.prototype.slice.call(arguments, 1, arguments.length - 1);

  if(typeof next !== "function") next = function(){};
  if(!this.handlers.length) return next();

  var self = this;
  var handlerI = -1;
  var handlerNext = function(err){
    if(err) return next(err);
    if(err === false) return next();

    handlerI++;
    if(handlerI >= self.handlers.length) return next();

    var args = handlerArgs.slice();
    args.unshift(bot);
    args.push(handlerNext);

    var handler = self.handlers[handlerI];
    if(handler instanceof Route){
      handler.receive.apply(handler, args);
    }else{
      handler.apply(null, args);
    }
  };

  handlerNext(null);

}

module.exports = Route;
