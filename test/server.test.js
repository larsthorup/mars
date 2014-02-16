var expect = require('chai').expect;
var sinon = require('sinon');

var restify = require('restify');
var server = require('../src/server');
var router = require('../src/router');

describe('server', function () {
    var sandbox;
    var restifyServer;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        restifyServer = {
            name: 'serverName',
            url: 'serverUrl',
            listen: sandbox.spy()
        };
        sandbox.stub(restify, 'createServer', function () { return restifyServer; });
        sandbox.stub(router, 'map');
        sandbox.stub(console, 'log');
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('start', function () {

        beforeEach(function () {
            server.start();
        });

        it('names the server', function () {
            expect(restify.createServer).to.have.been.calledWith({ name: 'mars' });
        });

        it('maps the routes', function () {
            expect(router.map).to.have.been.calledWith(restifyServer);
        });

        it('listens on the right port', function () {
            expect(restifyServer.listen).to.have.been.calledWith(1719);
        });

        it('tells how it listens', function () {
            var listenCallback = restifyServer.listen.getCall(0).args[1];
            listenCallback();
            expect(console.log).to.have.been.calledWith('%s listening at %s', 'serverName', 'serverUrl');
        });
    });
});

