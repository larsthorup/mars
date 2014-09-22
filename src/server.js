// ToDo: hosting (digial ocean)
// ToDo: zero downtime upgrades (http-proxy)

var restify = require('restify');
var router = require('./router');
var fs = require('fs');
var path = require('path');
var token = require('./token');
var bunyan = require('bunyan');
var ws = require('ws');

function start(options) {

    var certPath = path.resolve(__dirname, './config/certs');
    var certificate = fs.readFileSync(path.resolve(certPath, options.certName + '.cert'));
    var key = fs.readFileSync(path.resolve(certPath, options.certName + '.key'));

    var server = restify.createServer({
        name: 'mars',
        certificate: certificate,
        key: key,
        log: bunyan.createLogger(options.bunyan)
    });

    // Note: Log requests
    server.on('after', restify.auditLogger({
        log: server.log
    }));

    // Note: Parse body of POST requests
    server.use(restify.bodyParser());

    // Note: Parse Authentication header
    server.use(token.requestParser());

    // Note: Handle CORS
    server.use(restify.CORS(options.cors));
    server.on('MethodNotAllowed', function unknownMethodHandler(req, res) {
        if (req.method.toLowerCase() === 'options') {
            var allowHeaders = [
                'Accept',
                'Accept-Version',
                'Content-Type',
                'Api-Version',
                'Origin',
                'X-Requested-With',
                'Authorization',
                'If-Match'
            ];

            if (res.methods.indexOf('OPTIONS') === -1) {
                res.methods.push('OPTIONS');
            }

            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
            res.header('Access-Control-Allow-Methods', res.methods.join(', '));
            res.header('Access-Control-Allow-Origin', req.headers.origin);

            return res.send(200);
        }
        else {
            return res.send(new restify.MethodNotAllowedError(req.method));
        }
    });

    // map routes
    router.map(server);

    // handle web sockets
    var wss = new ws.Server({
        server: server.server
    });

    // ToDo: refactor into a clients.js module
    var subscriptions = {};
    var latestConnectionId = 0;
    wss.on('connection', function (connection) {
        console.log('WebSocket connection established');
        connection.id = ++latestConnectionId;
        connection.subscriptions = {};
        connection.on('close', function (code, message) {
            console.log('WebSocket connection closed', code, message);
            // ToDo: remove any subscriptions
        });
        // ToDo: could we avoid the closure by having the connection being passed to the callback?
        connection.on('message', function (data) {
            var message = JSON.parse(data);
            if(message.verb === 'SUBSCRIBE') {
                console.log('SUBSCRIBE', message.path);
                // ToDo: error handling
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

    // start listening
    server.listen(1719, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}

module.exports = {
    start: start
};
