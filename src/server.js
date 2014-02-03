// ToDo: tests
// ToDo: authorization

var restify = require('restify');
var controller = require('./controller/hello');

var server = restify.createServer();
server.get('/hello/:name', controller.hello);
server.head('/hello/:name', controller.hello);
server.get(/\/static\/?.*/, restify.serveStatic({
    directory: './static'
}));

server.listen(1719, function() {
    console.log('%s listening at %s', server.name, server.url);
});