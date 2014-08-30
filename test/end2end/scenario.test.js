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
        https.get({
            host: 'localhost',
            port: 1719,
            path: '/hello/Lars'
        }, function (response) {
            response.on('data', function (data) {

                done();
            });
        });
    });

});