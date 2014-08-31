// ToDo: modular routing

var restify = require('restify');
var request = require('./request');
var greet = require('./controller/greet');
var auth = require('./controller/auth');

var hello = request.process(greet.greeting);
var authenticate = request.process(auth.authenticating);

function map(server) {
    server.get('/hello/:name', hello);
    server.head('/hello/:name', hello);
    server.post('/auth/authenticate/:user', authenticate);
    server.get(/\/static\/?.*/, restify.serveStatic({
        directory: './static'
    }));
}

module.exports = {
    map: map,
    hello: hello,
    authenticate: authenticate
};