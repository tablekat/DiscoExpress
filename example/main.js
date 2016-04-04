

//== Discord Reqs ==
var Discord = require("../node_modules/discord.js");
var AuthDetails = require("./auth.json");
var bot = new Discord.Client();



//== Database ==
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var databaseUrl = 'mongodb://...:...@example.com/Database';
var _db; //Database connection


var DiscoExpress = require('../src/discoexpress.js');
var app = new DiscoExpress();

function setupDiscoExpress(){

  // This middleware will prevent any command routes from running, if the sender is the bot itself
  app.route(require("./middleware/ignoreself.js"));

  // Normal command! Once a command is reached, it stops calling next()
  app.route(require("./commands/tablehelp.js"));

  // This command takes config, and returns a command route function
  app.route(require("./commands/tableflip.js")({
    prefix: "!"
  }));

  // The following route pretends to use the database
  app.route(require("./commands/tableroll.js")(_db));

}


bot.on("ready", function() {
  console.log("[StartUp] bot ready.");

  setupDiscoExpress();

  /*mongoClient.connect(databaseUrl, function(err, db) {
    if (err) {
      console.log("Unable to connect to Database! Error: " + err)
    } else {
      console.log("Connected to: " + databaseUrl);
      _db = db;
      setupDiscoExpress();
    };

  });*/
});

bot.on("disconnected", function() {
  console.log("[Disconnected]");
  bot.login(AuthDetails.email, AuthDetails.password);
});

bot.on("message", function(msg) {

  app.receive(bot, msg);

});


bot.login(AuthDetails.email, AuthDetails.password);
