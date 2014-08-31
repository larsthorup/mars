var mars = require('../util/mars-api');

describe('scenario', function () {
    var bearerToken;

    before(function () {
        bearerToken = 'larsSecret';
        mars.database.recreate();
        return mars.starting();
    });

    after(function () {
        mars.stop();
    });

    it('greets friends', function () {
        return mars.getting('/hello/Lars', bearerToken).should.become('hello Lars');
    });

    it('fails on foes', function () {
        return mars.getting('/hello/Putin', bearerToken).should.be.rejectedWith('does not compute: Putin');
    });

});