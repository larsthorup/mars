// ToDo: encryption (https)
// ToDo: authentication (basic auth over https)
// ToDo: hosting (digial ocean)
// ToDo: modular authorization
// ToDo: zero downtime upgrades (http-proxy)

var restify = require('restify');
var router = require('./router');
var fs = require('fs');
var path = require('path');

function start(options) {

    var certificate = fs.readFileSync(path.resolve(__dirname, '../conf/certs/' + options.certName + '.cert'));
    var key = fs.readFileSync(path.resolve(__dirname, '../conf/certs/' + options.certName + '.key'));

    var server = restify.createServer({
        name: 'mars',
        certificate: certificate,
        key: key
    });
    router.map(server);
    server.listen(1719, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}

module.exports = {
    start: start
};
