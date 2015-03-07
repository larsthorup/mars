var Clients = require('../../src/clients').Clients;
var ws = require('ws');
var token = require('../../src/token');
var auth = require('../../src/auth');
var match = require('./match');

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
        sandbox.stub(token, 'authenticate').returns('aUser');
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

        describe('when receiving an unauthenticated subscribe message', function () {

            beforeEach(function () {
                sandbox.stub(auth, 'user').returns(false);
                messageHandler.call(connection, '{"verb": "SUBSCRIBE", "auth": "aBearer", "path": "pathA"}');
            });

            it('should perform authorization', function () {
                token.authenticate.should.have.been.calledWith('aBearer');
                auth.user.should.have.been.calledWith({userName: 'aUser'});
            });

            it('not sends patches when notified', function () {
                clients.notifyPatch({path: 'pathA'});
                connection.send.callCount.should.equal(0);
            });
        });

        describe('when receiving an authenticated subscribe message', function () {

            beforeEach(function () {
                sandbox.stub(auth, 'user').returns(true);
                messageHandler.call(connection, '{"verb": "SUBSCRIBE", "auth": "aBearer", "path": "pathA"}');
                messageHandler.call(connection, '{"verb": "SUBSCRIBE", "auth": "aBearer", "path": "pathB"}');
            });

            it('sends confirmation to the subscribed client', function () {
                connection.send.should.have.been.calledWith(match.json({
                    verb: 'SUBSCRIBED',
                    path:'pathA'
                }));
                connection.send.should.have.been.calledWith(match.json({
                    verb: 'SUBSCRIBED',
                    path:'pathB'
                }));
            });

            describe('notifyPatch', function () {

                beforeEach(function () {
                    clients.notifyPatch({
                        path: 'pathA'
                    });
                });

                it('sends the patch to the subscribed client', function () {
                    connection.send.should.have.been.calledWith(match.json({
                        verb: 'EVENT',
                        type: 'PATCH',
                        path:'pathA'
                    }));
                    //JSON.parse(connection.send.getCall(0).args[0]).should.deep.equal({
                    //    verb: 'EVENT',
                    //    type: 'PATCH',
                    //    path:'pathA'
                    //});
                });

            });

            describe('when receiving an unsubscribe message', function () {

                beforeEach(function () {
                    messageHandler.call(connection, '{"verb": "UNSUBSCRIBE", "path": "pathA"}');
                });

                it('no longer sends patches when notified', function () {
                    clients.notifyPatch({path: 'pathA'});
                    connection.send.callCount.should.equal(2 + 0); // Note: none in addition to the two SUBSCRIBED events
                });

            });

            describe('when closing the connection', function () {

                beforeEach(function () {
                    closeHandler.call(connection);
                });

                it('no longer sends patches when notified', function () {
                    clients.notifyPatch({path: 'pathA'});
                    connection.send.callCount.should.equal(2 + 0); // Note: none in addition to the two SUBSCRIBED events
                });

            });
        });

    });

});