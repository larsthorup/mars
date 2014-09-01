var restify = require('restify');
var server = require('../../src/server');
var router = require('../../src/router');
var fs = require('fs');
var path = require('path');

describe('server', function () {
    var restifyServer;

    beforeEach(function () {
        restifyServer = {
            name: 'serverName',
            url: 'serverUrl',
            listen: sandbox.spy(),
            use: sandbox.spy()
        };
        sandbox.stub(restify, 'createServer', function () { return restifyServer; });
        sandbox.stub(restify, 'bodyParser', function () { return 'theBodyParser'; });
        sandbox.stub(fs, 'readFileSync', function (filePath) {
            if(path.resolve(__dirname, '../../conf/certs/someCertificate.cert') === filePath) { return 'theCert'; }
            if(path.resolve(__dirname, '../../conf/certs/someCertificate.key') === filePath) { return 'theKey'; }
        });
        sandbox.stub(router, 'map');
        sandbox.stub(console, 'log');
    });

    describe('start', function () {

        beforeEach(function () {
            server.start({certName: 'someCertificate'});
        });

        it('names the server', function () {
            restify.createServer.getCall(0).args[0].should.deep.equal({
                name: 'mars',
                certificate: 'theCert',
                key: 'theKey'
            });
            // Hmm... this suddenly started failing, replacing with code above...
//            restify.createServer.should.have.been.calledWith({
//                name: 'mars',
//                certificate: 'theCert',
//                key: 'theKey'
//            });
        });

        it('parses the body', function () {
            restifyServer.use.should.have.been.calledWith('theBodyParser');
        });

        it('maps the routes', function () {
            router.map.should.have.been.calledWith(restifyServer);
        });

        it('listens on the right port', function () {
            restifyServer.listen.should.have.been.calledWith(1719);
        });

        it('tells how it listens', function () {
            var listenCallback = restifyServer.listen.getCall(0).args[1];
            listenCallback();
            console.log.should.have.been.calledWith('%s listening at %s', 'serverName', 'serverUrl');
        });
    });
});

