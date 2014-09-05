// ToDo: authentication (basic auth over https)
// ToDo: hosting (digial ocean)
// ToDo: modular authorization
// ToDo: zero downtime upgrades (http-proxy)

var restify = require('restify');
var router = require('./router');
var fs = require('fs');
var path = require('path');
var token = require('./token');

function start(options) {

    var certificate = fs.readFileSync(path.resolve(__dirname, '../conf/certs/' + options.certName + '.cert'));
    var key = fs.readFileSync(path.resolve(__dirname, '../conf/certs/' + options.certName + '.key'));

    var server = restify.createServer({
        name: 'mars',
        certificate: certificate,
        key: key
    });

    // Note: Parse body of POST requests
    server.use(restify.bodyParser());

    // Note: Parse Authentication header
    server.use(token.requestParser());

    // Note: Handle CORS
    server.use(restify.CORS(options.cors));
    server.on('MethodNotAllowed', function unknownMethodHandler(req, res) {
        if (req.method.toLowerCase() === 'options') {
            var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization']; // added Origin & X-Requested-With & **Authorization**

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
            return res.send(new restify.MethodNotAllowedError());
        }
    });

    router.map(server);
    server.listen(1719, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}

module.exports = {
    start: start
};
