/* globals -Promise, process */
var api = require('../util/api.proxy');
// api.trace = true;

var Promise = require('bluebird');


describe('scenario in process', function () {
    before(function () {
        return api.starting();
    });

    after(function () {
        return api.stopping().then(function () {
            api.saveTraffic('dist/test/api.sample.json');
        });
    });

    describe('authentication', function () {

        it('authenticates existing user', function () {
            return api.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'lars123'}).should.become({ token: '{\"user\":\"Lars\",\"hashed\":true}'});
        });

        it('fails authenticating existing user with wrong password', function () {
            return api.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'qwerty'}).should.be.rejectedWith('invalid user name or password');
        });

        it('fails authenticating non-existing user', function () {
            return api.posting('/auth/authenticate/unknown', '0.1.0', {}).should.be.rejectedWith('invalid user name or password');
        });

    });

    describe('authorization', function () {
        var token;

        before(function () {
            return api.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'lars123'}).then(function (result) {
                 token = result.token;
            });
        });

        it('authorizes authenticated requests', function () {
            return api.getting('/hello/Lars', '0.1.0', token).should.become('hello Lars');
        });

        it('rejects fake authentication', function () {
            return api.getting('/hello/Lars', '0.1.0', 'invalidToken').should.be.rejectedWith('not authorized');
        });

    });

    describe('versioning', function () {

        it('succeeds when version range can be satisfied', function () {
            return api.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'lars123'}).should.become({ token: '{\"user\":\"Lars\",\"hashed\":true}'});
        });

        it('fails when version range cannot be satisfied', function () {
            return api.posting('/auth/authenticate/Lars', '0.0.5', {pass: 'lars123'}).should.be.rejectedWith('0.0.5 is not supported by POST /auth/authenticate/Lars');
        });

        describe('when version range not specified', function () {
            var token;

            beforeEach(function () {
                return api.posting('/auth/authenticate/Lars', null, {pass: 'lars123'}).then(function (result) {
                    token = result.token;
                });
            });

            it('defaults to latest version', function () {
                return api.getting('/hello/Rob', null, token).should.become({greeting: 'hello Rob'});
            });
        });
    });

    describe('real time notification', function () {
        var token;

        before(function () {
            return api.posting('/auth/authenticate/Lars', '0.1.0', {pass: 'lars123'}).then(function (result) {
                token = result.token;
            });
        });

        describe('when subscribing', function () {

            before(function () {
                api.subscribe('/entry/1', token);
                return Promise.delay(1000); // ToDo: wait for SUBSCRIBE ack
            });

            describe('when posting a patch', function () {

                before(function () {
                    return api.posting('/auth/authenticate/Lars', null, {pass: 'lars123'}).then(function (result) {
                        return result.token;
                    }).then(function (token) {
                        return api.patching('/entry/1', null, {title:'newTitle'}, 1, token);
                    });
                });

                it('should notify', function () {
                    return api.nextMessage().should.eventually.become({
                        verb: 'EVENT',
                        type: 'PATCH',
                        path: '/entry/1',
                        fromVersion: '1',
                        patch: {
                            title:'newTitle',
                            version: 2
                        },
                        toVersion: '2'
                    });
                });

            });

        });

    });

});