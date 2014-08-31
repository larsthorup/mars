var https = require('https');
var process = require('child_process');
var P = require('bluebird');



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

    it('greets', function (done) {
        // ToDo: use promises
        // ToDo: marsApi that converts messages to rejections
        https.get({
            host: 'localhost',
            port: 1719,
            path: '/hello/Lars',
            rejectUnauthorized: false
        }, function (response) {
            response.on('data', function (data) {
                var result = JSON.parse(data.toString());
                should.not.exist(result.message);
                result.should.equal('hello Lars');
                done();
            });
        });
    });

    it('returns errors', function (done) {
        // ToDo: use promises
        https.get({
            host: 'localhost',
            port: 1719,
            path: '/hello/Putin',
            rejectUnauthorized: false
        }, function (response) {
            response.on('data', function (data) {
                var result = JSON.parse(data.toString());
                result.message.should.equal('does not compute: Putin');
                done();
            });
        });
    });

});