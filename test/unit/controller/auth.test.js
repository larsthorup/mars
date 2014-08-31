var auth = require('../../../src/controller/auth');
var repo = require('../../../stub/repo.stub.js');

describe('controller', function () {

    describe('auth', function () {

        describe('authenticate', function () {

            beforeEach(function () {
                repo.stub({
                    users: [
                        {name: 'lars'}
                    ]
                });
            });

            it('should authenticate valid user with valid password', function () {
                return auth.authenticating({ params: { user: 'lars' } }).should.become({token: 'secret'});
            });

            it('should refuse non existing user', function () {
                return auth.authenticating({ params: { user: 'unknown' } }).should.be.rejected;
            });
        });
    });

});