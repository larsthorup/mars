var restify = require('restify');
var userRepo = require('../model/users.js');

function hello(req, res, next) {
    var name = req.params.name;
    userRepo.findingByName(name)
    .then(function (users) {
        if(users.length < 1) {
            return next(new restify.InternalError('does not compute'));
        } else {
            res.send('hello ' + users[0].name);
            return next();
        }
    });
}

module.exports = {
    hello: hello
};
