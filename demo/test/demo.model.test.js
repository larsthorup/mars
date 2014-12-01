describe('model', function () {
    var fakeExchanges;
    var server;

    before(function (done) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../../mars.api.sample.json', true);
        xhr.onload = function () {
            var apiSample = JSON.parse(this.responseText);
            fakeExchanges = {};
            apiSample.forEach(function (sampleExchange) {
                var fakeExchange = {
                    method: sampleExchange.request.method,
                    uri: sampleExchange.request.uri,
                    version: sampleExchange.request.headers['accept-version'],
                    form: sampleExchange.request.form,
                    statusCode: sampleExchange.response.statusCode,
                    headers: {},
                    body: JSON.stringify(sampleExchange.response.body)
                };
                // console.log(fakeExchange.method, fakeExchange.uri, fakeExchange.version, fakeExchange.form, fakeExchange.statusCode, fakeExchange.body);
                var key = JSON.stringify({method: fakeExchange.method, uri: fakeExchange.uri});
                var fakeExchangeList = fakeExchanges[key] || [];
                fakeExchangeList.push(fakeExchange);
                fakeExchanges[key] = fakeExchangeList;
            });
            // Note: adding test specific data
            var key = JSON.stringify({method: 'GET', uri: 'https://mars.com/weather/'});
            fakeExchanges[key] = [{
                version: '^0.9.4',
                form: {},
                statusCode: 200,
                headers: {},
                body: JSON.stringify({text: 'dim'})
            }];
            done();
        };
        xhr.send();
    });

    beforeEach(function () {
        server = window.sinon.fakeServer.create();
        server.respondWith(function (request) {
            var keyString = JSON.stringify({method: request.method, uri: request.url});
            var acceptVersion = request.requestHeaders['Accept-Version'];
            // console.log(keyString);
            var fakeExchangeList = fakeExchanges[keyString];
            var mockExchange;
            if(fakeExchangeList) {
                for (var i = 0; i < fakeExchangeList.length; ++i) {
                    var fakeExchange = fakeExchangeList[i];
                    if (fakeExchange.version === acceptVersion) {
                        // ToDo: take form data into consideration
                        mockExchange = fakeExchange;
                        break;
                    }
                }
            }
            if(mockExchange) {
                // console.log(mockExchange.method, mockExchange.uri, mockExchange.version, mockExchange.form, mockExchange.statusCode, mockExchange.body);
                request.respond(mockExchange.statusCode, mockExchange.headers, mockExchange.body);
            } else {
                request.respond(404, {}, 'Not Found');
            }
        });
        server.autoRespond = true;
        server.autoRespondAfter = 1;
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