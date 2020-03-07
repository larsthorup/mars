var fs = require('fs');
var path = require('path');
var restify = require('restify');
/* globals -Promise */
var Promise = require('bluebird');

var corsWrapper = require('./cors');
var router = require('./router');
var token = require('./token');
var output = require('./output');

function starting(app) {
    var options = app.options.server;
    return new Promise(function (resolve, reject) {
        var certPath = path.resolve(__dirname, './config/certs');
        var certificate = fs.readFileSync(path.resolve(certPath, options.certName + '.cert'));
        var key = fs.readFileSync(path.resolve(certPath, options.certName + '.key'));

        var server = restify.createServer({
            name: app.options.app.name,
            certificate: certificate,
            key: key,
            log: app.options.log
        });

        // Note: Log requests
        server.on('after', restify.plugins.auditLogger({
            event: 'after',
            log: server.log
        }));

        // Note: Parse body of POST requests
        server.use(restify.plugins.bodyParser());

        // Note: Parse Authentication header
        server.use(token.requestParser());

        // Note: Handle CORS
        var cors = corsWrapper.middleware({
            allowHeaders: [
                'Authorization',
                'If-Match'
            ],
            exposeHeaders: [],
            origins: ['https://localhost:1718'],
            preflightMaxAge: 5
        });
        server.pre(cors.preflight);
        server.use(cors.actual);

        // map routes
        server.use(function appExposer (req, res, next) {
            req.app = app; // Note: expose app to controllers
            next();
        });
        router.map(server);

        // handle web socket subscriptions from clients
        app.clients = new (require('./clients').Clients)(server);

        // start listening
        server.listen(1719, function () {
            if(!app.options.app.silent) {
                output.log('%s listening at %s', server.name, server.url);
            }
            resolve(server);
        });

        server.on('close', function () {
            if(!app.options.app.silent) {
                output.log('%s closing down', server.name);
            }
        });
    });
}

module.exports = {
    starting: starting
};
