var mars = require('../util/mars-api');

describe('scenario', function () {
    before(function () {
        // ToDo: recreate database
        return mars.starting();
    });

    after(function () {
        mars.stop();
    });

    it('greets friends', function () {
        return mars.getting('/hello/Lars').should.eventually.equal('hello Lars');
    });

    it('fails on foes', function () {
        return mars.getting('/hello/Putin').should.be.rejectedWith('does not compute: Putin');
    });

});