var restify = require('restify');
var server = require('../../src/server');
var router = require('../../src/router');
var fs = require('fs');
var path = require('path');
var bunyan = require('bunyan');

describe('server', function () {
    var restifyServer;

    beforeEach(function () {
        restifyServer = {
            name: 'serverName',
            url: 'serverUrl',
            listen: sandbox.spy(),
            use: sandbox.spy(),
            on: sandbox.spy()
        };
        sandbox.stub(restify, 'createServer', function (options) { restifyServer.log = options.log; return restifyServer; });
        sandbox.stub(restify, 'bodyParser', function () { return 'theBodyParser'; });
        sandbox.stub(restify, 'CORS', function () { return 'theCorsHandler'; });
        sandbox.stub(restify, 'auditLogger', function () { return 'theAuditLogger'; });
        sandbox.stub(fs, 'readFileSync', function (filePath) {
            if(path.resolve(__dirname, '../../src/config/certs/someCertificate.cert') === filePath) { return 'theCert'; }
            if(path.resolve(__dirname, '../../src/config/certs/someCertificate.key') === filePath) { return 'theKey'; }
        });
        sandbox.stub(router, 'map');
        sandbox.stub(console, 'log');
        sandbox.stub(bunyan, 'createLogger', function () { return 'theBunyanLogger'; });
    });

    describe('start', function () {

        beforeEach(function () {
            server.start({
                certName: 'someCertificate',
                cors: 'someCorsConfig',
                bunyan: 'someBunyanConfig'
            });
        });

        it('names the server', function () {
            restify.createServer.getCall(0).args[0].should.deep.equal({
                name: 'mars',
                certificate: 'theCert',
                key: 'theKey',
                log: 'theBunyanLogger'
            });
            // Hmm... this suddenly started failing, replacing with code above...
//            restify.createServer.should.have.been.calledWith({
//                name: 'mars',
//                certificate: 'theCert',
//                key: 'theKey'
//            });
        });

        it('does audit logging', function () {
            restifyServer.on.should.have.been.calledWith('after', 'theAuditLogger');
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

        describe('CORS', function () {

            it('handles CORS', function () {
                restify.CORS.getCall(0).args[0].should.equal('someCorsConfig');
            });

            it('handles OPTIONS requests', function () {
                restifyServer.on.getCall(1).args[0].should.equal('MethodNotAllowed');
            });

            it('responds correctly to OPTIONS requests', function () {
                // given
                var unknownMethodHandler = restifyServer.on.getCall(1).args[1];
                var req = {
                    method: 'OPTIONS',
                    headers: {
                        origin: 'someOrigin'
                    }
                };
                var res = {
                    methods: [],
                    header: sandbox.spy(),
                    send: sandbox.spy()
                };

                // when
                unknownMethodHandler(req, res);

                // then
                res.header.getCall(2).args.should.deep.equal(['Access-Control-Allow-Methods', 'OPTIONS']);
                res.header.getCall(3).args.should.deep.equal(['Access-Control-Allow-Origin', 'someOrigin']);
                res.send.should.have.been.calledWith(200);
            });

            it('fails on unrecognized verbs', function () {
                var unknownMethodHandler = restifyServer.on.getCall(1).args[1];
                var req = {
                    method: 'unrecognized'
                };
                var res = {
                    send: sandbox.spy()
                };

                // when
                unknownMethodHandler(req, res);

                // then
                res.send.getCall(0).args[0].name.should.equal('MethodNotAllowedError');
            });

        });
    });
});

