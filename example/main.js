
var DiscoExpress = require('../src/index');
var AuthDetails = require("./auth.json");


function setupDiscoExpress(){
  var app = new DiscoExpress();

  app.on("ready", () => {
    console.log("[StartUp] bot ready.");
  });
  app.on("disconnected", () => {
    console.log("[Disconnected]");
    app.login(AuthDetails.email, AuthDetails.password);
  });

  app.on("message", (bot, msg, next) => {
    console.log("I got a message!", msg.content);
  });

  // This middleware will prevent any command routes from running, if the sender is the bot itself
  app.on("message", require("./middleware/ignoreself.js"));

  // Normal command! Once a command is reached, it stops calling next()
  app.on("message", require("./commands/tablehelp.js"));

  // This command takes config, and returns a command route function
  app.on("message", require("./commands/tableflip.js")({
    prefix: "!"
  }));

  // The following route pretends to use the database
  var db = "magic";
  app.on("message", require("./commands/tableroll.js")(db));


  // Require a user to have a role to run a command.
  var requireMod = require("./middleware/require-role")(["admin", "moderator", "Trusted Employee"]);
  app.on("message", requireMod, (bot, msg, next) => {
    if(msg.content === "!modcmd"){
      bot.reply(msg, "Moderator only command!");
    }else{
      return;
    }
  });

  // Alternatively, you can create subroutes manually!
  var subroute = new DiscoExpress.Route();
  subroute.route((bot, msg, next) => {
    if(msg.content.startsWith("!times2")){
      return;
    }else{
      // return false to break from a subroute, and continue processing the parent route.
      return false;
    }
  });
  subroute.route((bot, msg, next) => {
    // Should only get to this route if command starts with !times2, as per the handler above this.
    // Make sure ignoreself middleware is enabled, or this message will trigger itself repeatedly!
    bot.sendMessage(msg.channel, msg.content + msg.content);
  });
  app.on("message", subroute);






  app.login(AuthDetails.token);

}

setupDiscoExpress();
