'use strict';

var builder = require('botbuilder');
var restify = require('restify');
//var process = require('./env.js');
var assert = require('assert');
var appRestifyClient = require('./client.js');
var NewQuestion = require('./dialogs/newQuestion.js');
var TopQuestion = require('./dialogs/topQuestion.js');
var RecentQuestion = require('./dialogs/recentQuestion.js');
var Login = require('./dialogs/login.js');
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
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var model = 'https://api.projectoxford.ai/luis/v1/application?id=f232d015-1572-46d2-a0fd-7654bd78a8fb&subscription-key=71124d57bb794eeab26b0943fc7aa840';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });


//=========================================================
// Define Dialogs
//=========================================================

var newQuestionDialog = new NewQuestion(bot, builder);
var topQuestionDialog = new TopQuestion(bot, builder);
var recentQuestionDialog = new RecentQuestion(bot, builder);
var loginDialog = new Login(bot, builder);

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', intents);

intents.matches('Login', [
    function (session) {
        session.beginDialog('/login');
    },
    function (session, results) {
    }
]);

intents.matches('TopQuestion', [
    function (session) {
        session.beginDialog('/topQuestion');
    },
    function (session, results) {

    }
]);

intents.matches('RecentQuestion', [
    function (session) {
        session.beginDialog('/recentQuestion');
    },
    function (session, results) {

    }
]);

intents.matches('NewQuestion', [
    function (session) {
        session.beginDialog('/newQuestion');
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.userProfile || !session.userData.userProfile.name) {
            session.beginDialog('/login');
        }
        else {
            next();
        }
    },
    function (session, results) {
        if(!session.userData.userProfile)
        {
             session.userData.userProfile = {};
        }
        session.send('Hello %s', session.userData.userProfile.name || '!');
    }
]);

intents.matches('ChangeName', [
    function (session) {

        session.beginDialog('/profile');

    },
    function (session, results) {
        session.send('Ok.. I have changed your name to %s', session.userData.userProfile.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, ['What should I call you?', 'What is your name?']);
    },
    function (session, results) {
        session.userData.userProfile = {};
        session.userData.userProfile.name = results.response;
        session.endDialog();
    }
]);
