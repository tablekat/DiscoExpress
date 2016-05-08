# DiscoExpress

Super lightweight express-like routing for discord bots

This acts as a wrapper to discord.js, but provides support for middleware-style
routing for discord.js events.

### Example

See `/example` for more.

```js
var DiscoExpress = require('discoexpress');
var app = new DiscoExpress();

app.on("ready", () => console.log("Bot ready"));
app.on("disconnected", () => console.log("Disconnected :("));

app.on("message", (bot, msg, next) => {
  // Ignore messages from myself
  // If next is not called, none of the handlers past this point get called!
  if(msg.sender.id != bot.user.id) return next();
});

app.on("message", (bot, msg, next) => {
  // This handler gets called, and then always continues to the next one
  console.log("Got message:", msg.content);
  return next();
});

app.on("message", (bot, msg, next) => {
  // The message "!fliptable" will match both this handler AND the "!flip" handler!
  // Put this one first, to match the more specific of the two, and then do
  // not call next. This way the !flip handler never runs redundantly.
  if(msg.content == "!fliptable"){
    bot.reply(msg, "No don't flip tables");
  }else{
    next();
  }
});

app.on("message", (bot, msg, next) => {
  // If the !fliptable handler matched, it never gets to this point, so the
  // bot won't reply twice.
  if(msg.content.startsWith("!flip")){
    bot.reply(msg, (Math.random() < 0.5) ? "Heads" : "Tails");
  }else{
    next();
  }
});

app.login("[token]");
```
