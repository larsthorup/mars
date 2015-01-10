/* global process */
var fs = require('fs');
/* global -Promise */
var Promise = require('bluebird');
var request = require('request-promise');
var _ = require('lodash');
var booter = require('../../src/booter');
var repo = require('../../src/repo');

var appConfig = require('../../src/config/app.conf.js');
var options = _.merge({}, appConfig);
options.server.silent = true;

var booting;
var traffic;

function starting() {
    traffic = [];
    booting = booter.booting(options);
    return booting;
}

function stopping() {
    return booting.then(function (app) {
        app.server.close();
        return repo.disconnecting(app.repo);
    });
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
        exchange.response = result;
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

function saveTraffic(jsonFilePath) {
    var indent = 4;
    fs.writeFileSync(jsonFilePath, JSON.stringify(traffic, null, indent));
}

var proxy = module.exports = {
    trace: false,
    starting: starting,
    stopping: stopping,
    getting: getting,
    posting: posting,
    patching: patching,
    saveTraffic: saveTraffic
};
