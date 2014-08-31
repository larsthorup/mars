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
        return mars.posting('/auth/authenticate/Lars', {pass: 'lars123'}).should.become({ token: 'secret'});
    });

    it('fails authenticating existing user with wrong password', function () {
        return mars.posting('/auth/authenticate/Lars', {pass: 'qwerty'}).should.become({ token: 'secret'});
    });

    it('fails authenticating non-existing user', function () {
        return mars.posting('/auth/authenticate/unknown', {}).should.be.rejectedWith({code: 'InternalError', message: 'invalid user name or password'});
    });

    it('greets friends', function () {
        var bearerToken = 'larsSecret';
        return mars.getting('/hello/Lars', bearerToken).should.become('hello Lars');
    });

    it('fails on foes', function () {
        var bearerToken = 'larsSecret';
        return mars.getting('/hello/Putin', bearerToken).should.be.rejectedWith({code: 'InternalError', message: 'does not compute: Putin'});
    });

});