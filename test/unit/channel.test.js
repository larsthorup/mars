var Channel = require('../../src/channel');

describe('Channel', function () {
    var channel;

    beforeEach(function () {
        channel = new Channel();
    });

    describe('when more takes', function () {
        var gettingFirst;

        beforeEach(function () {
            gettingFirst = channel.take();
        });

        it('should queue resolving', function () {
            gettingFirst.isPending().should.equal(true);
        });

        describe('when puts catches up with takes', function () {

            beforeEach(function () {
                channel.put('first');
            });

            it('should resolve', function () {
                return gettingFirst.should.eventually.become('first');
            });

            describe('when more puts', function () {
                var gettingSecond;

                beforeEach(function () {
                    channel.put('second');
                    gettingSecond = channel.take();
                });

                it('should resolve immediately', function () {
                    gettingSecond.value().should.equal('second');
                });

            });
        });
    });
});