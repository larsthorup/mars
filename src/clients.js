var ws = require('ws');

// ToDo: avoid singleton pattern
var subscriptions = {};
var latestConnectionId = 0;

function connect(server) {
    var wss = new ws.Server({
        server: server.server
    });

    wss.on('connection', function (connection) {
        connection.id = ++latestConnectionId;
        console.log('WebSocket connection established', connection.id);
        connection.subscriptions = {};
        connection.on('close', function (code, message) {
            console.log('WebSocket connection closed', connection.id, code, message);
            // ToDo: remove any subscriptions
        });
        // ToDo: could we avoid the closure by having the connection being passed to the callback?
        connection.on('message', function (data) {
            var message = JSON.parse(data);
            // ToDo: refactor to avoid if statements
            if(message.verb === 'SUBSCRIBE') {
                console.log('SUBSCRIBE', message.path);
                // ToDo: error handling
                subscriptions[message.path] = subscriptions[message.path] || {};
                subscriptions[message.path][connection.id] = connection;
                connection.subscriptions[message.path] = true;
            }
            if(message.verb === 'UNSUBSCRIBE') {
                console.log('UNSUBSCRIBE', message.path);
                // ToDo: error handling
                delete subscriptions[message.path][connection.id];
                delete connection.subscriptions[message.path];
            }
        });
    });
}

module.exports = {
    connect: connect
};