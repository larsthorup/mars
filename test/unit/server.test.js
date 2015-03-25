var fs = require('fs');
var path = require('path');
var restify = require('restify');

var server = require('../../src/server');
var router = require('../../src/router');
var clients = require('../../src/clients');
var token = require('../../src/token');
var sinon = require('sinon');
var output = require('../../src/output');

describe('server', function () {
    var sandbox;
    var restifyServer;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
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
        sandbox.stub(token, 'requestParser', function () { return 'theAuthenticationHeaderParser'; });
        sandbox.stub(output, 'log');
        sandbox.stub(clients, 'Clients').returns({});
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('starting', function () {
        var app;
        var starting;

        beforeEach(function () {
            app = {
                options: {
                    log: 'someLogger',
                    app: {
                        name: 'someAppName'
                    },
                    server: {
                        certName: 'someCertificate',
                        cors: 'someCorsConfig'
                    }
                }
            };
            starting = server.starting(app);
        });

        it('names the server', function () {
            restify.createServer.getCall(0).args[0].should.deep.equal({
                name: 'someAppName',
                certificate: 'theCert',
                key: 'theKey',
                log: 'someLogger'
            });
            // Hmm... this suddenly started failing, replacing with code above...
            //restify.createServer.should.have.been.calledWith({
            //    name: 'someAppName',
            //    certificate: 'theCert',
            //    key: 'theKey'
            //});
        });

        it('does audit logging', function () {
            restifyServer.on.should.have.been.calledWith('after', 'theAuditLogger');
        });

        it('parses the body', function () {
            restifyServer.use.should.have.been.calledWith('theBodyParser');
        });

        it('parses the authentication header', function () {
            restifyServer.use.should.have.been.calledWith('theAuthenticationHeaderParser');
        });

        it('passes app to controllers through req', function () {
            var appExposer = restifyServer.use.getCall(3).args[0];
            appExposer.name.should.equal('appExposer');
            var req = {};
            var next = sandbox.spy();
            appExposer(req, null, next);
            req.app.should.equal(app);
            next.should.have.been.calledWith();
        });

        it('maps the routes', function () {
            router.map.should.have.been.calledWith(restifyServer);
        });

        it('connect to clients', function () {
            clients.Clients.should.have.been.calledWith(restifyServer);
        });

        it('listens on the right port', function () {
            restifyServer.listen.should.have.been.calledWith(1719);
        });

        it('tells how it listens', function () {
            starting.isFulfilled().should.equal(false); // yet
            var listenCallback = restifyServer.listen.getCall(0).args[1];
            listenCallback();
            output.log.should.have.been.calledWith('%s listening at %s', 'serverName', 'serverUrl');
            return starting.should.become(restifyServer);
        });

        it('tells when it shuts down', function () {
            restifyServer.on.getCall(2).args[0].should.equal('close');
            restifyServer.on.getCall(2).args[1]();
            output.log.should.have.been.calledWith('%s closing down', 'serverName');
        });

        describe('CORS', function () {

            it('parses CORS headers', function () {
                restifyServer.use.should.have.been.calledWith('theCorsHandler');
            });

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
                res.header.getCall(1).args[0].should.equal('Access-Control-Allow-Headers');
                res.header.getCall(1).args[1].should.contain('Authorization');
                res.header.getCall(1).args[1].should.contain('If-Match');
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

