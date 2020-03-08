var auth = require('../../src/auth');

describe('auth', function () {

    describe('anyone', function () {

        it('does not care', function () {
            auth.anyone().should.equal(true);
        });

    });

    describe('user', function () {

        it('accepts a user', function () {
            auth.user({userName: 'Lars'}).should.equal(true);
        });

        it('rejects a non-user', function () {
            auth.user({}).should.equal(false);
        });

    });

});
