# DiscoExpress

Lightweight express-like routing for discord bots

This acts as a wrapper to discord.js, but provides support for middleware-style
routing for discord.js events.

### Example

See `/example/mainWithHelpers.js` for more.

```js
var DiscoExpress = require('discoexpress');
var app = new DiscoExpress()
  .on("ready", () => console.log("Bot ready"))
  .on("disconnected", () => console.log("Disconnected"))

  // Log all messages that come through, then continue to other handlers.
  .on("message", () => {
    console.log("Got message:", msg.content);
    next();
  })

  // Ignore messages from myself - don't call any handlers after this one
  // if the message author is this bot
  .on("message", DiscoExpress.ignoreSelf)

  // Reply to the message "!ping" with "pong!"
  .on("message",
    DiscoExpress.contentMatches("!ping"),
    DiscoExpress.reply("pong!")
  )

  // Reply can take a function as an argument, and contentMatches can take a regexp
  .on("message",
    DiscoExpress.contentMatches(/^!flip/),
    DiscoExpress.reply(() => Math.random() < 0.5 ? "Heads" : "Tails")
  );

  // This message will never be reached, because the !flip handler above will always
  // catch the message "!fliptable"
  .on("message",
    DiscoExpress.contentMatches("!fliptable"),
    DiscoExpress.reply("No don't flip tables")
  )

  // See /src/helpers for all the helpers available, and see the examples below for
  // writing your own handlers
  .on("message",
    DiscoExpress.requireRole(["admin", "mod"]),
    DiscoExpress.contentMatches("!modcmd"),
    DiscoExpress.reply("you just used a mod command!", true)
  )

  // A more complicated example
  .on("message",
    DiscoExpress.requirePermission("manageRoles"),
    DiscoExpress.contentMatches(/!setcolor ([^\s]+) ([a-zA-Z0-9]{6})$/),  // Only accept role names without spaces, for simplicity
    DiscoExpress.withArgs((args, bot, msg, next) => {
      var roleName = args[1];
      var color = args[2];

      var role = msg.channel.server.roles.get('name', roleName);

      bot.updateRole(role, {
        color: parseInt(color, 16)
      }, function(err, role){
        if(err) return bot.reply(msg, "Failed to update role color: " + err.message);
        bot.reply(msg, "Role " + role.name + " updated!");
      });
    })
  )

  .login("[token]");


```


### Example without DiscoExpress helpers

See `/example/main.js` for more.

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

// Other events can be routed the same way.
app.on("serverNewMember", (bot, server, user, next) => {
  console.log("Logging new member join:", user.name);
  return next();
});
app.on("serverNewMember", (bot, server, user, next) => {
  // Greet the user in the general channel.
  bot.sendMessage(server.id, "Welcome " + user + "!");
  return next();
});

app.login("[token]");
```

### Advanced Routes

Passing multiple handlers to `app.on` will create a subroute. A subroute can
have its own middleware. This can be useful, for example, to make a subroute
where only people with the role "Moderator" can run the commands.

A subroute can be broken out of with `next(false)`.

```js

// Multiple handlers can be given to one call of app.on(). This will create a
// sub-route, which can be broken out of by calling next(false);
var requireMod = require('discoexpress-require-role')(["Moderator", "Admin"]);
app.on("message", requireMod, (bot, msg, next) => {
  // Only users with a role named "Moderator" or "Admin" can run this command!
  if(msg.content == "!modcmd"){
    bot.reply(msg, "A moderator ran this command!");
  }else{
    next();
  }
});


// Alternatively, you can create subroutes manually!
var subroute = new DiscoExpress.Route();
subroute.route((bot, msg, next) => {
  if(msg.content.startsWith("!times2")){
    return next();
  }else{
    // call next(false) to break from a subroute, and continue processing the parent route.
    return next(false);
  }
});
subroute.route((bot, msg, next) => {
  // Should only get to this route if command starts with !times2, as per the handler above this.
  // Make sure ignoreself middleware is enabled, or this message will trigger itself repeatedly!
  bot.sendMessage(msg.channel, msg.content + msg.content);
});
app.on("message", subroute);

```
