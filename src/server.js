// ToDo: hosting (digial ocean)
// ToDo: zero downtime upgrades (http-proxy)

var bunyan = require('bunyan');
var fs = require('fs');
var path = require('path');
var restify = require('restify');
/* globals -Promise */
var Promise = require('bluebird');

var router = require('./router');
var token = require('./token');

function starting(options) {
    return new Promise(function (resolve, reject) {
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
        server.use(function (req, res, next) {
            req.server = server; // Note: expose server to controllers
            next();
        });
        router.map(server);

        // handle web socket subscriptions from clients
        server.clients = new (require('./clients').Clients)(server);

        // start listening
        server.listen(1719, function () {
            console.log('%s listening at %s', server.name, server.url);
            resolve(server);
        });
    });
}

module.exports = {
    starting: starting
};
