var process = require('child_process');
var P = require('bluebird');
var request = require('request-promise');

var server; // Note: only one instance is supported

function starting() {
    server = process.fork('src/mars.js');
    return P.delay(1000); // Note: give the server time to finish startup
}

function stop() {
    server.kill();
}

function requesting(method, path, bearerToken) {
    var options = {
        uri: 'https://localhost:1719' + path,
        method: method,
        json: true,
        strictSSL: false,
        headers: {
        }
    };
    // ToDo: set .form
    if(bearerToken) {
        options.headers.authorization = 'Bearer ' + bearerToken;
    }
    var promise = request(options);
    if(mars.trace) {
        promise.then(function (data) {
            console.dir(data);
            return data;
        }).catch(function (error) {
            console.dir(error);
            throw error;
        });
    }
    return promise;
}

function getting(path, bearerToken) {
    return requesting('GET', path, bearerToken);
}

function posting(path, bearerToken) {
    return requesting('POST', path, bearerToken);
}

var mars = module.exports = {
    trace: false,
    starting: starting,
    stop: stop,
    getting: getting,
    posting: posting
};
