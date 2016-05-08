
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
    return next();
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


  app.login(AuthDetails.email, AuthDetails.password);

}

setupDiscoExpress();
