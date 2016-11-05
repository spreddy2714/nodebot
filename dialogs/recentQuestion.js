'use strict';

var appRestifyClient = require('../client.js');

function RecentQuestion(bot, builder) {
    bot.dialog('/recentQuestion', [
        function (session) {
            appRestifyClient.getRecentQuestion(function (data) {
                var msg = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachments([
                        new builder.HeroCard(session)
                            .title(data.title)
                            .subtitle(data.category)
                            .text(data.description)
                            .images([
                                builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                            ])
                            .tap(builder.CardAction.openUrl(session, "http://questfy.ubiqfy.com/#/stu/question/view/" + data.id))
                    ]);
                session.endDialog(msg);
            });
            session.endDialog();
        },
        function (session, results) {
            session.endDialog();
        }
    ]);
}

module.exports = RecentQuestion;