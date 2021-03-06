var greetController = require('../../../src/controller/greet');
var repo = require('../../stub/repo.stub.js');
var token = require('../../../src/token');
var auth = require('../../../src/auth');
var sinon = require('sinon');

describe('controller/greet', function () {
    var sandbox;
    var app;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        app = {};
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('hello, 0.1.0', function () {
        var hello;

        beforeEach(function () {
            hello = greetController.getMethod('/hello/:name', '=0.1.0', 'get');
            repo.stub({
                sandbox: sandbox,
                user: [
                    {name: 'lars'}
                ]
            });
            sandbox.stub(token, 'authenticate').callsFake(function () { return 'Lars'; });
        });

        it('should allow user access', function () {
            hello.authorize.should.equal(auth.user);
        });

        it('should say hello', function () {
            return hello.processing({ params: { name: 'lars' }, headers: {}, app: app }).should.become('hello lars');
        });

        it('should refuse to say hello to putin', function () {
            return hello.processing({ params: { name: 'putin' }, headers: {}, app: app }).should.be.rejectedWith('does not compute: putin');
        });
    });

    describe('hello, 0.1.5', function () {
        var hello;

        beforeEach(function () {
            hello = greetController.getMethod('/hello/:name', '=0.1.5', 'get');
            repo.stub({
                sandbox: sandbox,
                user: [
                    {name: 'lars'}
                ]
            });
            sandbox.stub(token, 'authenticate').callsFake(function () { return 'Lars'; });
        });

        it('should allow user access', function () {
            hello.authorize.should.equal(auth.user);
        });

        it('should say hello', function () {
            return hello.processing({ params: { name: 'lars' }, headers: {}, app: app }).should.become({greeting: 'hello lars' });
        });

        it('should refuse to say hello to putin', function () {
            return hello.processing({ params: { name: 'putin' }, headers: {}, app: app }).should.be.rejectedWith('User not found: putin');
        });
    });
});

