var fs = require('fs');
var process = require('child_process');
var assert = require('assert');
var P = require('bluebird');
var https = require('../util/https-promise');
var knexfile = require('../../knexfile');

var server; // Note: only one instance is supported

function recreateDatabase() {
    assert.equal(knexfile.development.client, 'sqlite3'); // ToDo: extend to other providers
    var dbfile = knexfile.development.connection.filename;
    if(fs.existsSync(dbfile)) {
        fs.unlinkSync(dbfile);
    }
}

function starting() {
    server = process.fork('src/mars.js');
    return P.delay(1000); // Note: give the server time to finish startup
}

function stop() {
    server.kill();
}

function requesting(method, path, bearerToken) {
    return new P(function (resolve, reject) {
        var options = {
            host: 'localhost',
            port: 1719,
            path: path,
            method: method,
            rejectUnauthorized: false,
            headers: {
            }
        };
        if(bearerToken) {
            options.headers.authorization = 'Bearer ' + bearerToken;
        }
        https.requesting(options).then(function (response) {
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

function getting(path, bearerToken) {
    return requesting('GET', path, bearerToken);
}

function posting(path, bearerToken) {
    return requesting('POST', path, bearerToken);
}

module.exports = {
    database: {
        recreate: recreateDatabase
    },
    starting: starting,
    stop: stop,
    getting: getting,
    posting: posting
};
