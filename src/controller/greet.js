var restify = require('restify');
var repo = require('../repo.js');

function hello(req, res, next) {
    var name = req.params.name;
    repo.users.findingByName(name)
    .then(function (users) {
        if(users.length < 1) {
            return next(new restify.InternalError('does not compute: ' + name));
        } else {
            res.send('hello ' + users[0].name);
            return next();
        }
    });
}

module.exports = {
    hello: hello
};
