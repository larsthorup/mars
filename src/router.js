var greet = require('./controller/greet');
var restify = require('restify');

function map(server) {
    server.get('/hello/:name', greet.hello);
    server.head('/hello/:name', greet.hello);
    server.get(/\/static\/?.*/, restify.serveStatic({
        directory: './static'
    }));
}

module.exports = {
    map: map
};