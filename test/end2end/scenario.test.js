var mars = require('../util/mars-api');

describe('scenario', function () {
    before(function () {
        mars.database.recreate();
        return mars.starting();
    });

    after(function () {
        mars.stop();
    });

    it('greets friends', function () {
        return mars.getting('/hello/Lars').should.become('hello Lars');
    });

    it('fails on foes', function () {
        return mars.getting('/hello/Putin').should.be.rejectedWith('does not compute: Putin');
    });

});