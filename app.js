var builder = require('botbuilder');
var restify = require('restify');
var process = require('./env.js');
var assert = require('assert');
var RestifyClient = require('./client.js');
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

RestifyClient.login({}, function (err, req, res, obj) {
    console.log('%j', obj);
    // session.beginDialog('/profile');
});
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
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
        appRestifyClient.login({}, function (err, req, res, obj) {
            console.log('%j', obj);
            session.beginDialog('/profile');
        });
    },
    function (session, results) {
        session.send('Ok.. I have changed your name to %s', session.userData.name);
    }
]);

intents.matches(/^Picture/i, [
    function (session) {
        session.beginDialog('/picture');
    },
    function (session, results) {
        session.send('How is the picture like?');
    }
]);

intents.matches(/^login/i, [
    function (session) {
        session.beginDialog('/login');
    },
    function (session, results) {
        session.send('How is the picture like?');
    }
]);


intents.onDefault([function (session, args, next) {
    if (!session.userData.name) {
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

bot.dialog('/picture', [
    function (session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
        session.endDialog(msg);
    },
    function (session, results) {
        session.endDialog();
    }
]);


bot.dialog('/login', [
    function (session) {
        var signinCard = new builder.SigninCard(session)
            .button("Login", "http://questfy.ubiqfy.com/#/login")
            .text("Login")
        var msg = new builder.Message(session)
            .attachments([
                signinCard
            ]);
        console.log(signinCard.toAttachment());
        session.endDialog(msg);
    },
    function (session, results) {
        session.endDialog();
    }
]);