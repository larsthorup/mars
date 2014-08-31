var https = require('https');





describe('scenario', function () {

    before(function () {
        // recreate database
        // start server
        // wait until started
    });

    after(function () {
        // stop server
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