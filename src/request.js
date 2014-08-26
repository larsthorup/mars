var restify = require('restify');

var process = function (controller) {
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
    process: process
};