var hasher = require('../../src/model/hasher');

describe('mode', function () {
    describe('hasher', function () {
        var hash;

        beforeEach(function () {
            hash = hasher.generate('abc123');
        });

        it('should verify the password', function () {
            expect(hasher.verify('abc123', hash)).to.equal(true);
        });
    });
});