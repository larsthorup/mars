var router = require('../src/router');
var restify = require('restify');
var greet = require('../src/controller/greet');

describe('router', function () {
    var server;

    beforeEach(function () {
        sandbox.stub(restify, 'serveStatic');
        server = {
            get: sandbox.spy(),
            head: sandbox.spy()
        };
    });

    describe('map', function () {

        beforeEach(function () {
            router.map(server);
        });

        it('maps hello', function () {
            server.get.should.have.been.calledWith('/hello/:name', greet.hello);
        });

        it('maps static files', function () {
            restify.serveStatic.should.have.been.calledWith({ directory: './static' });
            server.get.should.have.been.calledWith(/\/static\/?.*/);
        });

    });

});