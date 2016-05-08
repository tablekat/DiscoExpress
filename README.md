# DiscoExpress

Super lightweight express-like routing for discord bots

### Example

See `/example` for more.

```js
    var DiscoExpress = require('discoexpress');
    var app = new DiscoExpress();
    
    app.on("ready", () => console.log("Bot ready"));
    app.on("disconnected", () => console.log("Disconnected :("));
    
    app.on("message", (bot, msg, next) => {
      // Ignore messages from myself
      if(msg.sender.id != bot.user.id) return next();
    });
    
    app.on("message", (bot, msg, next) => {
      console.log("Got message:", msg.content);
      return next();
    });
    
    app.on("message", (bot, msg, next) => {
      if(msg.content == "!flip"){
        bot.reply(msg, (Math.random() < 0.5) ? "Heads" : "Tails");
      }else{
        next();
      }
    });
    
    app.login("[token]");
```
    
