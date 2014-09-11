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

function requesting(method, path, form, bearerToken) {
    var options = {
        uri: 'https://localhost:1719' + path,
        method: method,
        json: true,
        strictSSL: false,
        form: form,
        headers: {
        }
    };
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

function getting(path, bearerToken) {
    return requesting('GET', path, null, bearerToken);
}

function posting(path, form, bearerToken) {
    return requesting('POST', path, form, bearerToken);
}

var mars = module.exports = {
    trace: false,
    starting: starting,
    stop: stop,
    getting: getting,
    posting: posting
};
