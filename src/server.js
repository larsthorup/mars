// ToDo: tests
// ToDo: authentication
// ToDo: modular routing
// ToDo: modular authorization

var restify = require('restify');
var greet = require('./controller/greet');

function start() {

    var server = restify.createServer({
        name: 'mars'
    });
    server.get('/hello/:name', greet.hello);
    server.head('/hello/:name', greet.hello);
    server.get(/\/static\/?.*/, restify.serveStatic({
        directory: './static'
    }));

    server.listen(1719, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}

module.exports = {
    start: start
};
