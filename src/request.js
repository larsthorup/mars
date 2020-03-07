var errors = require('restify-errors');
var restify = require('restify');

var process = function (controller) {
    return function (req, res, next) {
        try {
            if (!controller.authorize(req)) {
                return next(new errors.NotAuthorizedError('not authorized'));
            } else {
                controller.processing(req)
                .then(function (result) {
                    res.send(result);
                    return next();
                })
                .catch(function (err) {
                    return next(new errors.InternalError(err.message));
                })
                .done();
            }
        } catch(ex) {
            next(new errors.InternalError(ex.message));
        }
    };
};

module.exports = {
    process: process
};
