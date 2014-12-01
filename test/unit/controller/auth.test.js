var authController = require('../../../src/controller/auth');
var repo = require('../../stub/repo.stub');
var hasher = require('../../../src/hasher');
var token = require('../../../src/token');
var auth = require('../../../src/auth');

describe('controller/auth', function () {

    describe('authenticate', function () {
        var authenticate;

        beforeEach(function () {
            authenticate = authController.getMethod('/auth/authenticate/:user', '0.1.0', 'post');
            repo.stub({
                user: [
                    {name: 'lars'}
                ]
            });
            sandbox.stub(hasher, 'verify', function (password) { return password === 'valid'; });
            sandbox.stub(token, 'create', function (user) { return user.name + '.token'; });
        });

        it('should allow anyone access', function () {
            authenticate.authorize.should.equal(auth.anyone);
        });

        it('should authenticate valid user with valid password', function () {
            return authenticate.processing({ params: { user: 'lars'}, body: { pass: 'valid' } }).should.eventually.have.property('token').that.equals('lars.token');
        });

        it('should reject valid user with invalid password', function () {
            return authenticate.processing({ params: { user: 'lars'}, body: { pass: 'invalid' } }).should.be.rejectedWith('invalid user name or password');
        });

        it('should reject non existing user', function () {
            return authenticate.processing({ params: { user: 'unknown' }, body: {} }).should.be.rejectedWith('invalid user name or password');
        });
    });
});
