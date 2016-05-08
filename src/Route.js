
function Route(){
  this.handlers = [];
}

Route.prototype.route = function(handler){
  if(typeof handler != "function"){
    throw new Error("Invalid handler");
  }
  this.handlers.push(handler);
}

Route.prototype.receive = function(){
  var bot = arguments[0];
  var next = null; //arguments[arguments.length - 1];
  var handlerArgs = Array.prototype.slice.call(arguments, 1, arguments.length /*- 1*/);

  if(typeof next !== "function") next = function(){};
  if(!this.handlers.length) return next();

  var self = this;
  var handlerI = -1;
  var handlerNext = function(err){
    if(err) return next(err);
    handlerI++;
    if(handlerI >= self.handlers.length) return next();

    var args = handlerArgs.slice();
    args.unshift(bot);
    args.push(handlerNext);

    self.handlers[handlerI].apply(null, args);
  };

  handlerNext(null);

}

module.exports = Route;
