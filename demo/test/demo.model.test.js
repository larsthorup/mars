describe('model', function () {
    var apiSample;
    var server;

    before(function (done) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../../mars.api.sample.json', true);
        xhr.onload = function () {
            apiSample = JSON.parse(this.responseText);
            done();
        };
        xhr.send();
    });

    beforeEach(function () {
        server = window.sinon.fakeServer.create();
        server.respondWith('GET', 'https://mars.com/weather/', function (request) {
            var acceptVersion = request.requestHeaders['Accept-Version'];
            var headers = {};
            if(acceptVersion === '^0.9.4') {
                request.respond(200, headers, '{"text":"dim"}');
            } else {
                request.respond(404, headers, '{"message":"Accept-Version ' + acceptVersion + ' of ' + request.method + ' ' + request.url + ' is not mocked"}');
            }
        });
        var once = false;
        apiSample.forEach(function (sampleExchange) {
            var method = sampleExchange.request.method;
            var uri = sampleExchange.request.uri;
            var statusCode = sampleExchange.response.statusCode;
            var headers = {};
            var body = JSON.stringify(sampleExchange.response.body);
            // ToDo: take form data into consideration
            // ToDo: build a proper map and configure sinon only with unique requests
            if (uri === 'https://localhost:1719/auth/authenticate/Lars' && statusCode === 200 && !once) {
                once = true;
                // console.log(method, uri, statusCode, body);
                server.respondWith(method, uri, function (request) {
                    request.respond(statusCode, headers, body);
                });
            }
        });
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    describe('authenticating', function () {
        var auth;

        beforeEach(function () {
            window.mars = {
                apiServer: 'localhost:1719'
            };
        });

        describe('when successful', function () {

            beforeEach(function () {
                auth = window.authenticating({user: 'Lars', pass: 'lars123'});
            });

            it('should resolve with a valid token', function () {
                return auth.should.become({token: '{"user":"Lars","hashed":true}'});
            });

        });

    });

    describe('requesting', function () {
        var weather;

        beforeEach(function () {
            window.mars = {
                apiServer: 'mars.com'
            };
        });

        describe('when successful', function () {

            beforeEach(function () {
                weather = window.requesting({
                    method: 'GET',
                    path: '/weather/',
                    versionRange: '^0.9.4'
                });
            });

            it('should resolve with the response', function () {
                return weather.should.become({text: 'dim'});
            });

        });

        describe('when versionRange is not mocked', function () {

            beforeEach(function () {
                weather = window.requesting({
                    method: 'GET',
                    path: '/weather/',
                    versionRange: '^1.0.0'
                });
            });

            it('should fail', function () {
                return weather.should.be.rejected;
            });

        });

        describe('when path is unrecognized', function () {
            var missing;

            beforeEach(function () {
                missing = window.requesting({
                    method: 'GET',
                    path: '/not-found/'
                });
            });

            it('should reject', function () {
                return missing.should.be.rejectedWith('Not Found');
            });

        });

    });

});