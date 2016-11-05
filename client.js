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

    this.getAuthorizedUrl = function (url) {
        return {
            path: url,
            headers: {
                'authorization': 'Bearer ' + this.getAccessToken()
            }
        };
    }
}

RestifyClient.prototype.login = function (credential, callback) {

    console.log(credential.username);
    var self = this;
    var url = "/app/rest/api/v1/oauth/token?client_id=sas-trusted-client&grant_type=password&password=" + credential.pwd + "&username=" + credential.username;
    self.jsonClient.get(url, function (err, req, res, obj) {
        self.setAccessToken(obj.access_token);
        if (obj.access_token) {
            callback(true);
        }
        else{
            callback(false);
        }
    });
};

RestifyClient.prototype.getProfile = function (username, callback) {

    var self = this;
    var url = "/app/rest/api/v1/secure/users?username=" + username;
    var options = this.getAuthorizedUrl(url);
    self.jsonClient.get(options, function (err, req, res, obj) {
        if (obj && obj.value) {
            callback(obj.value);
        }
    });
};

RestifyClient.prototype.getTopQuestion = function (callback) {

    var self = this;
    var url = "/app/rest/api/v1/secure/questions?orderBy=votesCount&orderReverse=true&pageNumber=1&pageSize=1";
    var options = this.getAuthorizedUrl(url);
    self.jsonClient.get(options, function (err, req, res, obj) {
        if (obj && obj.data && obj.data.length > 0) {
            callback(obj.data[0])
        }
    });
};

RestifyClient.prototype.getRecentQuestion = function (callback) {

    var self = this;
    var url = "/app/rest/api/v1/secure/questions?pageNumber=1&pageSize=1";
    var options = this.getAuthorizedUrl(url);
    self.jsonClient.get(options, function (err, req, res, obj) {
        if (obj && obj.data && obj.data.length > 0) {
            callback(obj.data[0])
        }
    });
};

RestifyClient.prototype.createQuest = function (quest, callback) {
    var self = this;
    var url = "/app/rest/api/v1/secure/questions";
    var options = this.getAuthorizedUrl(url);
    console.log('Authrized url' + options);
    self.jsonClient.post(options, quest, function (err, req, res, obj) {
        if (obj && obj.code == 0) {
            callback(true);
        }
    });
};

module.exports = new RestifyClient();
