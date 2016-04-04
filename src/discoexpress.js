

function DiscoExpress(){

  this.handlers = [];

}

DiscoExpress.prototype.route = function(handler){
  if(typeof handler != "function"){
    throw new Error("Invalid handler");
  }
  this.handlers.push(handler);
}

DiscoExpress.prototype.receive = function(bot, msg, next){
  if(typeof next !== "function") next = function(){};
  if(!this.handlers.length) return next();

  var self = this;
  var handlerI = -1;
  var handlerNext = function(err){
    //if(err) false; // do nothing
    handlerI++;
    if(handlerI >= self.handlers.length) return next();
    self.handlers[handlerI](bot, msg, handlerNext);
  };

  handlerNext(null);

}

module.exports = DiscoExpress;
