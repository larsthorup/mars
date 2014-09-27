var mars = require('../util/mars-api');
// mars.trace = true;

describe('scenario', function () {
    before(function () {
        return mars.starting();
    });

    after(function () {
        mars.stop();
    });

    it('warms up', function () {
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
});