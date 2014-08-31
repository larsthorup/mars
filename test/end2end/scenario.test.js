var process = require('child_process');
var P = require('bluebird');
var https = require('../util/https-promise');

describe('scenario', function () {
    var server;

    before(function () {
        // ToDo: recreate database

        // Note: start the server
        server = process.fork('src/mars.js', {
        });

        // Note: give the server time to finish startup
        return P.delay(1000);
    });

    after(function () {
        // Note: stop the server
        server.kill();
    });

    it('greets', function () {
        // ToDo: marsApi that converts messages to rejections
        return https.getting({
            host: 'localhost',
            port: 1719,
            path: '/hello/Lars',
            rejectUnauthorized: false
        })
        .then(function (response) {
            var result = JSON.parse(response.body);
            should.not.exist(result.message);
            result.should.equal('hello Lars');
        });
    });

    it('returns errors', function () {
        return https.getting({
            host: 'localhost',
            port: 1719,
            path: '/hello/Putin',
            rejectUnauthorized: false
        })
        .then(function (response) {
            var result = JSON.parse(response.body);
            result.message.should.equal('does not compute: Putin');
        });
    });

});