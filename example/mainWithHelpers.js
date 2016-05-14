
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

  app
    .on("message", DiscoExpress.ignoreSelf)

    .on("message", DiscoExpress.contentMatches("!ping"), DiscoExpress.reply("pong!"))

    .on("message",
      DiscoExpress.contentMatches(/^!echo/),
      DiscoExpress.withArgs((args, bot, msg, next) => {
        bot.reply(msg, args.slice(1).join(' '));
      })
    )

    .on("message",
      DiscoExpress.requireRole(["admin", "mod"]),
      DiscoExpress.contentMatches("!modcmd"),
      DiscoExpress.reply("you just used a mod command!", true)
    )

    .on("message",
      DiscoExpress.requirePermission("manageRoles"),
      DiscoExpress.contentMatches(/!setcolor ([^\s]+) #?([a-zA-Z0-9]{6})$/),  // Only accept role names without spaces, for simplicity
      DiscoExpress.withArgs((args, bot, msg, next) => {
        var role = args[1];
        return DiscoExpress.requireRole(role)(bot, msg, next);            // Only allow users to color their own role
      }),
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

    .on("message",
      DiscoExpress.contentMatches("!flip"),
      DiscoExpress.reply(() => Math.random() < 0.5 ? "Heads" : "Tails")
    );


  app.login(AuthDetails.email, AuthDetails.password);

}

setupDiscoExpress();
