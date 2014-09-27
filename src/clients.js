var ws = require('ws');

function Clients(server) {
    var subscriptions = new (require('./subscriptions').Subscriptions)();
    var connections = {};
    var latestClientId = 0;

    var webSocketServer = new ws.Server({
        server: server.server
    });

    webSocketServer.on('connection', function (connection) {
        var clientId = ++latestClientId;
        // console.log('WebSocket connection established', clientId);
        connections[clientId] = connection;
        connection.on('close', function (code, message) {
            // console.log('WebSocket connection closed', clientId, code, message);
            subscriptions.unsubscribeClient(clientId);
            delete connections[clientId];
        });
        connection.on('message', function (data) {
            var message = JSON.parse(data);
            // ToDo: refactor to avoid if statements
            if(message.verb === 'SUBSCRIBE') {
                // console.log('SUBSCRIBE', message.path);
                subscriptions.subscribe(clientId, message.path);
            }
            if(message.verb === 'UNSUBSCRIBE') {
                // console.log('UNSUBSCRIBE', message.path);
                subscriptions.unsubscribe(clientId, message.path);
            }
        });
    });

    this.notifyPatch = function notifyPatch(options) {
        var clients = subscriptions.getClients(options.path);
        clients.forEach(function(clientId) {
            var connection = connections[clientId];
            connection.send(JSON.stringify(options));
        });
    };
}

module.exports = {
    Clients: Clients
};