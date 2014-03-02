var restify = require('restify');
var server = require('../src/server');
var router = require('../src/router');
var fs = require('fs');

describe('server', function () {
    var restifyServer;

    beforeEach(function () {
        restifyServer = {
            name: 'serverName',
            url: 'serverUrl',
            listen: sandbox.spy()
        };
        sandbox.stub(restify, 'createServer', function () { return restifyServer; });
        sandbox.stub(fs, 'readFileSync')
            .withArgs('conf/certs/someCertificate.cert').returns('theCert')
            .withArgs('conf/certs/someCertificate.key').returns('theKey');
        sandbox.stub(router, 'map');
        sandbox.stub(console, 'log');
    });

    describe('start', function () {

        beforeEach(function () {
            server.start({certName: 'someCertificate'});
        });

        it('names the server', function () {
            expect(restify.createServer).to.have.been.calledWith({
                name: 'mars',
                certificate: 'theCert',
                key: 'theKey'
            });
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

