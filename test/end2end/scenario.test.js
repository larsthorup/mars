/* globals -WebSocket, -Promise, process */
var mars = require('../util/mars-api');
// mars.trace = true;

var WebSocket = require('ws');
var Promise = require('bluebird');


describe('scenario in process', function () {
    before(function () {
        return mars.starting();
    });

    after(function () {
        mars.stop();
        mars.saveTraffic('mars.api.sample.json');
    });

    it.skip('warms up', function () {
        this.timeout(5000);
        return mars.posting('/auth/authenticate/unknown', '*', {}).should.be.rejectedWith('invalid user name or password');
    });

    describe('authentication', function () {

        it('authenticates existing user', function () {
            return mars.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'lars123'}).should.become({ token: '{\"user\":\"Lars\",\"hashed\":true}'});
        });

        it('fails authenticating existing user with wrong password', function () {
            return mars.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'qwerty'}).should.be.rejectedWith('invalid user name or password');
        });

        it('fails authenticating non-existing user', function () {
            return mars.posting('/auth/authenticate/unknown', '0.1.0', {}).should.be.rejectedWith('invalid user name or password');
        });

    });

    describe('authorization', function () {
        var token;

        before(function () {
            return mars.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'lars123'}).then(function (result) {
                 token = result.token;
            });
        });

        it('authorizes authenticated requests', function () {
            return mars.getting('/hello/Lars', '0.1.0', token).should.become('hello Lars');
        });

        it('rejects fake authentication', function () {
            return mars.getting('/hello/Lars', '0.1.0', 'invalidToken').should.be.rejectedWith('not authorized');
        });

    });

    describe('versioning', function () {

        it('succeeds when version range can be satisfied', function () {
            return mars.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'lars123'}).should.become({ token: '{\"user\":\"Lars\",\"hashed\":true}'});
        });

        it('fails when version range cannot be satisfied', function () {
            return mars.posting('/auth/authenticate/Lars', '0.0.5', {pass: 'lars123'}).should.be.rejectedWith('0.0.5 is not supported by POST /auth/authenticate/Lars');
        });

        describe('when version range not specified', function () {
            var token;

            beforeEach(function () {
                return mars.posting('/auth/authenticate/Lars', null, {pass: 'lars123'}).then(function (result) {
                    token = result.token;
                });
            });

            it('defaults to latest version', function () {
                return mars.getting('/hello/Rob', null, token).should.become({greeting: 'hello Rob'});
            });
        });
    });

    describe('real time notification', function () {
        var ws;
        var messageData;

        before(function (done) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
            // ToDo: move to mars-api
            ws = new WebSocket('wss://localhost:1719');
            messageData = new Promise(function (resolve) {
                ws.on('message', function (data) {
                    resolve(data);
                });
            });
            ws.on('open', function () {
                done();
            });
        });

        describe('when subscribing', function () {

            before(function () {
                ws.send('{"verb":"SUBSCRIBE","path":"/entry/1"}');
                return Promise.delay(1000); // Note: give the server time to process subscription
            });

            describe('when posting a patch', function () {

                before(function () {
                    return mars.posting('/auth/authenticate/Lars', null, {pass: 'lars123'}).then(function (result) {
                        return result.token;
                    }).then(function (token) {
                        return mars.patching('/entry/1', null, {title:'newTitle'}, 1, token);
                    });
                });

                it('should notify', function () {
                    return messageData.should.eventually.become('{"path":"/entry/1","fromVersion":"1","patch":{"title":"newTitle","version":2},"toVersion":"2"}');
                });

            });

        });

    });

});