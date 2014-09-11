var process = require('child_process');
/* global -Promise */
var Promise = require('bluebird');
var request = require('request-promise');

var server; // Note: only one instance is supported

function starting() {
    server = process.fork('src/mars.js');
    return Promise.delay(1000); // Note: give the server time to finish startup
}

function stop() {
    server.kill();
}

function requesting(path, versionRange, method, form, bearerToken) {
    var options = {
        uri: 'https://localhost:1719' + path,
        method: method,
        json: true,
        strictSSL: false,
        form: form,
        headers: {
        }
    };
    if(versionRange) {
        options.headers['accept-version'] = versionRange;
    }
    if(bearerToken) {
        options.headers.authorization = 'Bearer ' + bearerToken;
    }
    return request(options).then(function (data) {
        if(mars.trace) {
            console.dir(data);
        }
        return data;
    }).catch(function (result) {
        if(mars.trace) {
            console.dir(result.error);
        }
        var error = new Error(result.error.message);
        error.code = result.error.code;
        throw error;
    });
}

function getting(path, versionRange, bearerToken) {
    return requesting(path, versionRange, 'GET', null, bearerToken);
}

function posting(path, versionRange, form, bearerToken) {
    return requesting(path, versionRange, 'POST', form, bearerToken);
}

var mars = module.exports = {
    trace: false,
    starting: starting,
    stop: stop,
    getting: getting,
    posting: posting
};
