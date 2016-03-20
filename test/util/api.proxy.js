/* global -Promise, -WebSocket, process */
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var WebSocket = require('ws');
var Promise = require('bluebird');
var request = require('request-har-capture');
var _ = require('lodash');
var booter = require('../../src/booter');
var repo = require('../../src/repo');
var Channel = require('../../src/channel');

var appConfig = require('../../src/config/app.conf.js');
var options = _.merge({}, appConfig);
options.app.args = {
    flags: {}
};
options.database.testdata = options.database.testdata || {};
options.database.testdata.create = true;
options.app.silent = true;

var booting;
var ws;
var messageChannel;

function starting() {
    messageChannel = new Channel();
    booting = booter.booting(options);
    return booting.then(function () {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        ws = new WebSocket('wss://localhost:1719');
        ws.on('message', function (data) {
            messageChannel.put(JSON.parse(data));
        });
        return new Promise(function (resolve) {
            ws.on('open', resolve);
        });
    });
}

function stopping() {
    return booting.then(function (app) {
        ws.close();
        app.server.close();
        return repo.disconnecting(app.repo);
    });
}

function nextMessage() {
    return messageChannel.take();
}

function requesting(path, apiVersionRange, method, body, dataVersion, bearerToken) {
    var options = {
        uri: 'https://localhost:1719' + path,
        method: method,
        strictSSL: false,
        body: body ? JSON.stringify(body) : null,
        headers: {
            'content-type': 'application/json'
        }
    };
    if(apiVersionRange) {
        options.headers['accept-version'] = apiVersionRange;
    }
    if(dataVersion) {
        options.headers['if-match'] = dataVersion;
    }
    if(bearerToken) {
        options.headers.authorization = 'Bearer ' + bearerToken;
    }
    if(proxy.trace) {
        console.dir(options);
    }
    return request(options).then(function (response) {
        var data = JSON.parse(response.body);
        if(proxy.trace) {
            console.dir(data);
        }
        if (response.statusCode === 200) {
            return data;
        } else {
            var error = new Error(data.message);
            error.code = data.code;
            throw error;
        }
    });
}

function getting(path, versionRange, bearerToken) {
    return requesting(path, versionRange, 'GET', null, null, bearerToken);
}

function posting(path, versionRange, body, bearerToken) {
    return requesting(path, versionRange, 'POST', body, null, bearerToken);
}

function patching(path, apiVersionRange, body, dataVersion, bearerToken) {
    return requesting(path, apiVersionRange, 'PATCH', body, dataVersion, bearerToken);
}

function subscribe(path, token) {
    var message = {
        verb: 'SUBSCRIBE',
        auth: 'Bearer ' + token,
        path: path
    };
    ws.send(JSON.stringify(message));
}

function saveTraffic(jsonFilePath) {
    request.saveHar(jsonFilePath);
}

var proxy = module.exports = {
    trace: false,
    starting: starting,
    stopping: stopping,
    getting: getting,
    posting: posting,
    patching: patching,
    nextMessage: nextMessage,
    subscribe: subscribe,
    saveTraffic: saveTraffic
};
