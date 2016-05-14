
// Promises
  app.on("message",
    (bot, msg) => {
      console.log("I got a message!", msg.content);
    },

    (bot, msg) => {
      if(!msg.content.startsWith("!test")){
        return false; // break from sub-route
      }
      bot.reply(msg, "test reply 1");
    },

    (bot, msg) => {
      // wait 2 seconds
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 2000)
      });
    },

    (bot, msg) => {
      return db.test
        .findAsync({ name: msg.author.name })
        .then((doc) => {
          bot.reply(msg, doc.relatedInfo);
          return null;
        });
    },

    (bot, msg) => {
      bot.reply(msg, "test reply 2");
      msg.stopPropagation();
    }
  );

// callbacks
  app.on("message",
    (bot, msg, next) => {
      console.log("I got a message!", msg.content);
      next();
    },

    (bot, msg, next) => {
      if(!msg.content.startsWith("!test")){
        return next(false); // break from sub-route
      }
      bot.reply(msg, "test reply 1");
      next();
    },

    function(bot, msg, next){
      // wait 2 seconds
      setTimeout(() => next(), 2000)
    },

    (bot, msg, next) => {
      db.test
        .find({ name: msg.author.name }, (err, doc) => {
          bot.reply(msg, doc.relatedInfo);
          next();
        });
    },

    (bot, msg, next) => {
      bot.reply(msg, "test reply 2");
      return;
    }
  );
