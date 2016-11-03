var restifyClient = require('restify-clients');

function RestifyClient() {
    this.newval = "Test";
    this.jsonClient = restifyClient.createJsonClient('http://questfy.ubiqfy.com');
}

RestifyClient.prototype.login = function (credential, callback) {
    return this.jsonClient.get('/app/rest/api/v1/classes', callback);
};

module.exports = new RestifyClient();
