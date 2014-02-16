// ToDo: tests
// ToDo: authentication
// ToDo: modular routing
// ToDo: modular authorization
// ToDo: schema initialization

var restify = require('restify');
var greet = require('./controller/greet');
var users = require('./model/users');

function start() {

    users.connect();
    users.droppingSchema().then(function () {
        return users.creatingSchema();
    }).then(function () {
        return users.creatingTestData();
    }).then(function () {

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
    });
}

module.exports = {
    start: start
};
