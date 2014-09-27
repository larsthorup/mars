var Clients = require('../../src/clients').Clients;
var ws = require('ws');

describe('clients', function () {
    var clients;
    var webSocketServer;
    var connectionHandler;

    beforeEach(function () {
        var server = {
            server: 'theServer'
        };
        webSocketServer = {
            on: sandbox.spy()
        };
        sandbox.stub(ws, 'Server').returns(webSocketServer);
        clients = new Clients(server);
        connectionHandler = webSocketServer.on.getCall(0).args[1];
    });

    it('registers a connection handler', function () {
        webSocketServer.on.should.have.been.calledWith('connection', connectionHandler);
    });

    describe('when receiving a connection', function () {
        var connection;
        var closeHandler;
        var messageHandler;

        beforeEach(function () {
            connection = {
                on: sandbox.spy(),
                send: sandbox.spy()
            };
            connectionHandler(connection);
            closeHandler = connection.on.getCall(0).args[1];
            messageHandler = connection.on.getCall(1).args[1];
        });

        it('registers a close handler', function () {
            connection.on.should.have.been.calledWith('close', closeHandler);
        });

        it('registers a message handler', function () {
            connection.on.should.have.been.calledWith('message', messageHandler);
        });

        describe('when receiving a subscribe message', function () {

            beforeEach(function () {
                messageHandler('{"verb": "SUBSCRIBE", "path": "pathA"}');
                messageHandler('{"verb": "SUBSCRIBE", "path": "pathB"}');
            });

            describe('notifyPatch', function () {

                beforeEach(function () {
                    clients.notifyPatch({
                        path: 'pathA'
                    });
                });

                it('sends the patch to the subscribed client', function () {
                    connection.send.should.have.been.calledWith('{"path":"pathA"}');
                });

            });

            describe('when receiving an unsubscribe message', function () {

                beforeEach(function () {
                    messageHandler('{"verb": "UNSUBSCRIBE", "path": "pathA"}');
                });

                it('no longer sends patches when notified', function () {
                    clients.notifyPatch({path: 'pathA'});
                    connection.send.callCount.should.equal(0);
                });

            });

            describe('when closing the connection', function () {

                beforeEach(function () {
                    closeHandler();
                });

                it('no longer sends patches when notified', function () {
                    clients.notifyPatch({path: 'pathA'});
                    connection.send.callCount.should.equal(0);
                });

            });
        });

    });

});