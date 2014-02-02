// ToDo: tests
// ToDo: serve static contents with mime types

var restify = require('restify');

function hello(req, res, next) {
    var name = req.params.name;
    if(name == 'putin') {
        return next(new restify.InternalError('does not compute'))
    } else {
        res.send('hello ' + name);
        return next();
    }
}

var server = restify.createServer();
server.get('/hello/:name', hello);
server.head('/hello/:name', hello);

server.listen(1719, function() {
    console.log('%s listening at %s', server.name, server.url)
})