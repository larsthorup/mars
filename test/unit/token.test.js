var token = require('../../src/token');

describe('token', function () {
    describe('create', function () {
        var sonnyToken;

        beforeEach(function () {
            sonnyToken = JSON.parse(token.create({name: 'Sonny'}));
        });

        it('should uniquely identify the user', function () {
            sonnyToken.user.should.equal('Sonny');
        });
        it('should be securly hashed (ha!)', function () {
            sonnyToken.hashed.should.equal(true);
        });
    });
});