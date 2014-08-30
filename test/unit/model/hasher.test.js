var hasher = require('../../../src/model/hasher');

describe('model', function () {
    describe('hasher', function () {
        var hash;

        beforeEach(function () {
            hash = hasher.generate('abc123');
        });

        it('should verify the password', function () {
            hasher.verify('abc123', hash).should.equal(true);
        });
    });
});