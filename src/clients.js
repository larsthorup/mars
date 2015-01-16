var ws = require('ws');
var auth = require('./auth');
var token = require('./token');

function Clients(server) {
    var subscriptions = new (require('./subscriptions').Subscriptions)();
    var connections = {};
    var latestClientId = 0;

    var webSocketServer = new ws.Server({
        server: server.server
    });
    webSocketServer.on('connection', onConnect);

    function onConnect(connection) {
        var clientId = ++latestClientId;
        connection.clientId = clientId;
        connections[clientId] = connection;
        // console.log('WebSocket connection established', clientId);
        connection.on('close', onDisconnect);
        connection.on('message', onMessage);
    }

    var messageHandlers = {
        'SUBSCRIBE': onSubscribe,
        'UNSUBSCRIBE': onUnsubscribe
    };

    function onMessage(data) {
        var message = JSON.parse(data);
        var handler = messageHandlers[message.verb];
        if(handler) {
            var userName = token.authenticate(message.auth);
            if(auth.user({userName: userName})) {
                handler.call(this, message);
            }
        }
    }

    function onSubscribe(message) {
        // console.log('SUBSCRIBE', message.path);
        subscriptions.subscribe(this.clientId, message.path);
    }

    function onUnsubscribe(message) {
        // console.log('UNSUBSCRIBE', message.path);
        subscriptions.unsubscribe(this.clientId, message.path);
    }

    function onDisconnect(code, message) {
        // console.log('WebSocket connection closed', clientId, code, message);
        subscriptions.unsubscribeClient(this.clientId);
        delete connections[this.clientId];
    }

    this.notifyPatch = function notifyPatch(options) {
        var clients = subscriptions.getClients(options.path);
        clients.forEach(function(clientId) {
            var connection = connections[clientId];
            options.verb = 'EVENT';
            options.type = 'PATCH';
            connection.send(JSON.stringify(options));
        });
    };
}

module.exports = {
    Clients: Clients
};