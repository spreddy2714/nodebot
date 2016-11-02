var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: "5a7ba1ce-cc46-48ee-88a3-627573df6f32",
    appPassword: "kT2RfNzdftzc8q8HHMvhcP3"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
var intents = new builder.IntentDialog();

bot.dialog('/', intents);

intents.matches(/^Change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok.. I have changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([function (session, args, next) {
        if(!session.userData.name){
            session.beginDialog('/profile');
        }
        else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s', session.userData.name);    
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi!! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
