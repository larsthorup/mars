var marsDb = require('../util/mars-db');
var mars = require('../util/mars-api');
// mars.trace = true;

describe('scenario', function () {
    before(function () {
        marsDb.recreate();
        return mars.starting();
    });

    after(function () {
        mars.stop();
    });

    it('authenticates existing user', function () {
        return mars.posting('/auth/authenticate/Lars', {pass: 'lars123'}).should.become({ token: '{\"user\":\"Lars\",\"hashed\":true}'});
    });

    it('fails authenticating existing user with wrong password', function () {
        return mars.posting('/auth/authenticate/Lars', {pass: 'qwerty'}).should.be.rejectedWith('invalid user name or password');
    });

    it('fails authenticating non-existing user', function () {
        return mars.posting('/auth/authenticate/unknown', {}).should.be.rejectedWith('invalid user name or password');
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