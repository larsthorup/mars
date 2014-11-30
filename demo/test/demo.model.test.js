describe('model', function () {

    beforeEach(function () {
        window.mars = {
            apiServer: 'mars.com'
        };
        this.server = window.sinon.fakeServer.create();
        this.server.respondWith('GET', 'https://mars.com/weather/', function (request) {
            var acceptVersion = request.requestHeaders['Accept-Version'];
            var headers = {};
            if(acceptVersion === '^0.9.4') {
                request.respond(200, headers, '{"text":"dim"}');
            } else {
                request.respond(404, headers, '{"message":"Accept-Version ' + acceptVersion + ' of ' + request.method + ' ' + request.url + ' is not mocked"}');
            }
        });
        this.server.autoRespond = true;
    });

    afterEach(function () {
        this.server.restore();
    });

    it('should mock XmlHttpRequest', function (done) {
        var test = this.test;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://mars.com/weather/', true);
        xhr.setRequestHeader('Accept-Version', '^0.9.4');
        xhr.onload = function () {
            this.status.should.equal(200);
            JSON.parse(this.responseText).should.deep.equal({text: 'dim'});
            done();
        };
        xhr.onerror = function () {
            test.error('expected request to succeed but failed');
            done();
        };
        xhr.send();
    });

    describe('requesting', function () {
        var weather;

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