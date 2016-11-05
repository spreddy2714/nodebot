'use strict';

var appRestifyClient = require('../client.js');

function Login(bot, builder) {
    bot.dialog('/login', [
        function (session) {
            if (!session.userData.userProfile || !session.userData.userProfile.firstName || !appRestifyClient.getAccessToken()) {
                session.send(['Hey welcome! lets start login to the world of quest!',
                    'Looks like I dont have your info, lets kick off!']);
                builder.Prompts.text(session, 'What is your username?');
            }
            else {
                session.send(['You are already logged in! Let the quest continue!']);
                session.endDialog();
            }
        },
        function (session, results) {
            session.userData.credential = {};
            session.userData.credential.username = results.response;
            builder.Prompts.text(session, 'I need your password too :)');
        },
        function (session, results) {
            session.userData.credential.pwd = results.response;
            console.log(session.userData.credential);

            appRestifyClient.login(session.userData.credential, function (loginSuccess) {
                if (loginSuccess) {
                    appRestifyClient.getProfile(session.userData.credential.username, function (userProfile) {
                        session.userData.userProfile = userProfile;
                        session.userData.userProfile.name = userProfile.firstName;
                        session.userData.credential = {};
                        session.send(['Welcome to the world of Quest!', 'Welcome ' + userProfile.firstName + ', hope you are doing good!']);
                    });
                }
                else {
                    session.send(['I am sorry! I have trouble logging in with these credential!']);
                }
            });
            session.endDialog();
        },
        function (session, results) {
            session.endDialog();
        }
    ]);
}

module.exports = Login;