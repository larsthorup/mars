describe('model', function () {
    var fakeApi;
    var server;

    before(function () {
        return window.apiFaker.loading('../../dist/test/api.sample.json')
        .then(function (result) {
            fakeApi = result;
            // Note: adding test specific data
            window.apiFaker.add(fakeApi, {
                method: 'GET',
                uri: 'https://app.com/weather/',
                version: '^0.9.4',
                requestBody: JSON.stringify({}),
                statusCode: 200,
                headers: {},
                responseBody: JSON.stringify({text: 'dim'})
            });
        });
    });

    beforeEach(function () {
        server = window.sinon.fakeServer.create();
        window.apiFaker.fake({server: server, api: fakeApi});
        server.autoRespond = true;
        server.autoRespondAfter = 1;
    });

    afterEach(function () {
        server.restore();
    });

    describe('api', function () {

        beforeEach(function () {
            window.app = {
                apiServer: 'localhost:1719'
            };
        });

        describe('authenticating', function () {
            var auth;

            describe('when successful', function () {

                beforeEach(function () {
                    auth = window.authenticating({user: 'Lars', pass: 'lars123'});
                });

                it('should resolve with a valid token', function () {
                    return auth.should.become({token: '{"user":"Lars","hashed":true}'});
                });

            });

            describe('when unsuccessful', function () {

                beforeEach(function () {
                    auth = window.authenticating({user: 'Lars', pass: 'lars987'});
                });

                it('should be rejected', function () {
                    return auth.should.be.rejected;
                });

            });

        });

        describe('greeting', function () {
            var greet;

            describe('when successful', function () {

                beforeEach(function () {
                    greet = window.greeting({name: 'Lars'});
                });

                it('should resolve with a greeting', function () {
                    return greet.should.become({message: 'hello Lars'});
                });

            });

            describe('when unsuccessful', function () {

                beforeEach(function () {
                    greet = window.greeting({name: 'Putin'});
                });

                it('should be rejected', function () {
                    return greet.should.be.rejected;
                });

            });

        });

        describe.skip('gettingLatestEntries', function () {
            // ToDo: need an end2end test to produce the sample exchange
        });

        describe('patchingEntry', function () {
            var entry;

            beforeEach(function () {
                entry = window.patchingEntry({
                    id: 1,
                    version: 1,
                    patch: {
                        title: 'newTitle'
                    }
                });
            });

            it('should resolve with the new version number', function () {
                entry.should.become({version: 2});
            });
        });

    });

    describe('requesting', function () {
        var weather;

        beforeEach(function () {
            window.app = {
                apiServer: 'app.com'
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