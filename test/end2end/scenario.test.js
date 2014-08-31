var mars = require('../util/mars-api');

describe('scenario', function () {
    before(function () {
        mars.database.recreate();
        return mars.starting();
    });

    after(function () {
        mars.stop();
    });

    it('authenticates existing user', function () {
        return mars.posting('/auth/authenticate/Lars').should.become({ token: 'secret'});
    });

    it('fails authenticating non-existing user', function () {
        return mars.posting('/auth/authenticate/unknown').should.be.rejectedWith('invalid user name or password');
    });

    it('greets friends', function () {
        var bearerToken = 'larsSecret';
        return mars.getting('/hello/Lars', bearerToken).should.become('hello Lars');
    });

    it('fails on foes', function () {
        var bearerToken = 'larsSecret';
        return mars.getting('/hello/Putin', bearerToken).should.be.rejectedWith('does not compute: Putin');
    });

});