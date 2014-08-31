var fs = require('fs');
var process = require('child_process');
var assert = require('assert');
var P = require('bluebird');
var https = require('../util/https-promise');
var knexfile = require('../../knexfile');

var server; // Note: only one instance is supported

function recreate() {
    assert.equal(knexfile.development.client, 'sqlite3'); // ToDo: extend to other providers
    fs.unlink(knexfile.development.connection.filename);
}

function starting() {
    server = process.fork('src/mars.js');
    return P.delay(1000); // Note: give the server time to finish startup
}

function stop() {
    server.kill();
}

function getting(path) {
    return new P(function (resolve, reject) {
        https.getting({
            host: 'localhost',
            port: 1719,
            path: path,
            rejectUnauthorized: false
        })
        .then(function (response) {
            var result = JSON.parse(response.body);
            if(result.message) {
                reject(result.message);
            } else {
                resolve(result);
            }
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

module.exports = {
    database: {
        recreate: recreate
    },
    starting: starting,
    stop: stop,
    getting: getting
};

