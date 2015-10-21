/* global -Promise, -WebSocket, process */
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var WebSocket = require('ws');
var Promise = require('bluebird');
var request = require('request-promise');
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
var traffic;
var ws;
var messageChannel;

function starting() {
    traffic = [];
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
        json: true,
        strictSSL: false,
        body: body,
        headers: {
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
    var exchange = {
        request: options
    };
    traffic.push(exchange);
    return request(options).then(function (data) {
        if(proxy.trace) {
            console.dir(data);
        }
        exchange.response = {
            statusCode: 200,
            body: data
        };
        return data;
    }).catch(function (result) {
        if(proxy.trace) {
            console.dir(result.error);
        }
        exchange.response = {
            statusCode: result.statusCode,
            error: result.error
        };
        var error = new Error(result.error.message);
        error.code = result.error.code;
        throw error;
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
    var indent = 4;
    mkdirp.sync(path.dirname(jsonFilePath));
    fs.writeFileSync(jsonFilePath, JSON.stringify(traffic, null, indent));
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
