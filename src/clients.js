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
        subscriptions.subscribe(this.clientId, message.path);
        var options = {
            verb: 'SUBSCRIBED',
            path: message.path
        };
        notify(this.clientId, options);
    }

    function onUnsubscribe(message) {
        subscriptions.unsubscribe(this.clientId, message.path);
    }

    function onDisconnect(code, message) {
        // console.log('WebSocket connection closed', clientId, code, message);
        subscriptions.unsubscribeClient(this.clientId);
        delete connections[this.clientId];
    }

    function notify(clientId, options) {
        var connection = connections[clientId];
        connection.send(JSON.stringify(options));
    }

    this.notifyPatch = function notifyPatch(options) {
        var self = this;
        var clients = subscriptions.getClients(options.path);
        options.verb = 'EVENT';
        options.type = 'PATCH';
        clients.forEach(function(clientId) {
            notify(clientId, options);
        });
    };
}

module.exports = {
    Clients: Clients
};