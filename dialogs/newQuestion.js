'use strict';

var appRestifyClient = require('../client.js');

function NewQuestion(bot, builder) {
    bot.dialog('/newQuestion', [
        function (session) {
            builder.Prompts.text(session, 'What is your quest?');
        },
        function (session, results) {
            var currentDate = new Date();
            session.userData.quest = {
                email: 'spreddy594@gmail.com', userId: 46,
                userName: 'Siva Prathap Reddy', categoryId: 2,
                creationDateTime: currentDate, lastUpdatedDateTime: currentDate
            };
            session.userData.quest.title = results.response;
            builder.Prompts.choice(session, 'Do you have any further explaination?', 'Yes|No');
        },
        function (session, results, next) {
            console.log(results.response);
            if (results.response && results.response.entity == 'Yes') {
                builder.Prompts.text(session, 'Explain');
            }
            else {
                next();
            }
        },
        function (session, results) {
            session.userData.quest.description = results.response || '';
            builder.Prompts.choice(session, 'Where is it belongs to?', 'Question|Research|Idea');
        },
        function (session, results) {
            var questTypes = [{
                code: 'PRB'
            }, {
                code: 'RSH'
            }, {
                code: 'IDA'
            }];
            var questTypeCode = questTypes[results.response.index].code
            console.log(questTypeCode);
            session.userData.quest.typeCode = questTypeCode;
            console.log(session.userData.quest);
            appRestifyClient.createQuest(session.userData.quest, function (status) {
                console.log(status);
                if (status) {
                    session.send('Done, posted!');
                }
            });
            session.endDialog();
        }
    ]);
}


module.exports = NewQuestion;