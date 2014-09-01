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

        it('should be securely hashed (ha!)', function () {
            sonnyToken.hashed.should.equal(true);
        });
    });

    describe('authenticate', function () {

        it('should return the user name from a valid token', function () {
            token.authenticate('Bearer ' + JSON.stringify({user: 'Sonny', hashed: true})).should.equal('Sonny');
        });

        it('should return null from an insecure token', function () {
            should.not.exist(token.authenticate('Bearer ' + JSON.stringify({user: 'Sonny', hashed: false})));
        });

        it('should return null from a misformatted token', function () {
            should.not.exist(token.authenticate('Bearer {user: Sonny, hashed: false}'));
        });

        it('should return null from an invalid token', function () {
            should.not.exist(token.authenticate('invalid token'));
        });
    });

    describe('requestParser', function () {
        var req;
        var next;

        beforeEach(function () {
            next = sandbox.spy();
            req = {
                headers: {
                    authorization: 'Bearer ' + JSON.stringify({user: 'Sonny', hashed: true})
                }
            };
            token.requestParser()(req, undefined, next);
        });

        it('should store the user in the request', function () {
            req.userName.should.equal('Sonny');
        });

        it('should chain to the next handler', function () {
            next.should.have.been.calledWith();
        });

    });
});