var greetController = require('../../../src/controller/greet');
var repo = require('../../stub/repo.stub.js');
var token = require('../../../src/token');
var auth = require('../../../src/auth');

describe('controller/greet', function () {
    var server;

    beforeEach(function () {
        server = { options: {}};
    });

    describe('hello, 0.1.0', function () {
        var hello;

        beforeEach(function () {
            hello = greetController.getMethod('/hello/:name', '=0.1.0', 'get');
            repo.stub({
                user: [
                    {name: 'lars'}
                ]
            });
            sandbox.stub(token, 'authenticate', function () { return 'Lars'; });
        });

        it('should allow user access', function () {
            hello.authorize.should.equal(auth.user);
        });

        it('should say hello', function () {
            return hello.processing({ params: { name: 'lars' }, headers: {}, server: server }).should.become('hello lars');
        });

        it('should refuse to say hello to putin', function () {
            return hello.processing({ params: { name: 'putin' }, headers: {}, server: server }).should.be.rejectedWith('does not compute: putin');
        });
    });

    describe('hello, 0.1.5', function () {
        var hello;

        beforeEach(function () {
            hello = greetController.getMethod('/hello/:name', '=0.1.5', 'get');
            repo.stub({
                user: [
                    {name: 'lars'}
                ]
            });
            sandbox.stub(token, 'authenticate', function () { return 'Lars'; });
        });

        it('should allow user access', function () {
            hello.authorize.should.equal(auth.user);
        });

        it('should say hello', function () {
            return hello.processing({ params: { name: 'lars' }, headers: {}, server: server }).should.become({greeting: 'hello lars' });
        });

        it('should refuse to say hello to putin', function () {
            return hello.processing({ params: { name: 'putin' }, headers: {}, server: server }).should.be.rejectedWith('User not found: putin');
        });
    });
});

