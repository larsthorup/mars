// ToDo: tests
// ToDo: authentication
// ToDo: modular routing
// ToDo: modular authorization

var restify = require('restify');
var router = require('./router');

function start() {

    var server = restify.createServer({
        name: 'mars'
    });
    router.map(server);
    server.listen(1719, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}

module.exports = {
    start: start
};
