var mars = require('../util/mars-api');
// mars.trace = true;

describe('scenario', function () {
    before(function () {
        return mars.starting();
    });

    after(function () {
        mars.stop();
    });

    describe('authentication', function () {

        it('authenticates existing user', function () {
            return mars.posting('/auth/authenticate/Lars', {pass: 'lars123'}).should.become({ token: '{\"user\":\"Lars\",\"hashed\":true}'});
        });

        it('fails authenticating existing user with wrong password', function () {
            return mars.posting('/auth/authenticate/Lars', {pass: 'qwerty'}).should.be.rejectedWith('invalid user name or password');
        });

        it('fails authenticating non-existing user', function () {
            return mars.posting('/auth/authenticate/unknown', {}).should.be.rejectedWith('invalid user name or password');
        });

    });

    describe('authorization', function () {
        var token;

        before(function () {
            return mars.posting('/auth/authenticate/Lars', {pass: 'lars123'}).then(function (result) {
                 token = result.token;
            });
        });

        it('authorizes authenticated requests', function () {
            return mars.getting('/hello/Lars', token).should.become('hello Lars');
        });

        it('rejects fake authentication', function () {
            return mars.getting('/hello/Lars', 'invalidToken').should.be.rejectedWith('not authorized');
        });

    });
});