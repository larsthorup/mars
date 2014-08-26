var restify = require('restify');
var repo = require('../repo.js');


function greeting(req) {
    var name = req.params.name;
    return repo.users.findingByName(name)
    .then(function (users) {
        if(users.length < 1) {
            throw new Error('does not compute: ' + name);
        } else {
            return 'hello ' + users[0].name;
        }
    });
}

var processRequest = function (controller) {
    return function (req, res, next) {
        controller(req)
        .then(function (result) {
            res.send(result);
            return next();
        })
        .catch(function (err) {
            return next(new restify.InternalError(err.message));
        })
        .done();
    };
};

module.exports = {
    hello: processRequest(greeting)
};
