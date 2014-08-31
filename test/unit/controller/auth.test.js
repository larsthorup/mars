var auth = require('../../../src/controller/auth');
var repo = require('../../../stub/repo.stub');
var hasher = require('../../../src/model/hasher');
var token = require('../../../src/token');

describe('controller', function () {

    describe('auth', function () {

        describe('authenticate', function () {

            beforeEach(function () {
                repo.stub({
                    users: [
                        {name: 'lars'}
                    ]
                });
                sandbox.stub(hasher, 'verify', function (password) { return password === 'valid'; });
                sandbox.stub(token, 'create', function (user) { return user.name + '.token'; });
            });

            it('should authenticate valid user with valid password', function () {
                return auth.authenticating({ params: { user: 'lars', pass: 'valid' } }).should.eventually.have.property('token').that.equals('lars.token');
            });

            it('should reject valid user with invalid password', function () {
                return auth.authenticating({ params: { user: 'lars', pass: 'invalid' } }).should.be.rejectedWith('invalid user name or password');
            });

            it('should reject non existing user', function () {
                return auth.authenticating({ params: { user: 'unknown' } }).should.be.rejectedWith('invalid user name or password');
            });
        });
    });

});