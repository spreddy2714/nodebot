var restifyClient = require('restify-clients');

function RestifyClient() {
    this.newval = "Test";
    this.jsonClient = restifyClient.createJsonClient('http://questfy.ubiqfy.com');
    this.accessToken = "";
    this.setAccessToken = function (token) {
        this.accessToken = token;
    };

    this.getAccessToken = function () {
        return this.accessToken;
    };
}

RestifyClient.prototype.login = function (credential, callback) {

    var self = this;
    var url = "/app/rest/api/v1/oauth/token?client_id=sas-trusted-client&grant_type=password&password=" + credential.pwd + "&username=" + credential.username;
    self.jsonClient.get(url, function (err, req, res, obj) {
        self.setAccessToken(obj.access_token);
        callback(true);
    });
};

RestifyClient.prototype.getTopQuestion = function (callback) {

    var self = this;
    var url = "/app/rest/api/v1/secure/questions?pageNumber=1&pageSize=1";
    var options = {
        path: url,
        headers: {
            'authorization': 'Bearer ' + self.getAccessToken()
        }
    }
    self.jsonClient.get(options, function (err, req, res, obj) {
        if (obj && obj.data && obj.data.length > 0) {
            callback(obj.data[0])
        }
    });
};

module.exports = new RestifyClient();
