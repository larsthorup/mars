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

module.exports = {
    hello: hello
}
