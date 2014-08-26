// ToDo: modular routing

var greet = require('./controller/greet');
var restify = require('restify');
var request = require('./request');

var hello = request.process(greet.greeting);

function map(server) {
    server.get('/hello/:name', hello);
    server.head('/hello/:name', hello);
    server.get(/\/static\/?.*/, restify.serveStatic({
        directory: './static'
    }));
}

module.exports = {
    map: map,
    hello: hello
};