var restify = require('restify');

var process = function (controller) {
    return function (req, res, next) {
        try {
            if (!controller.authorize(req)) {
                return next(new restify.NotAuthorizedError('not authorized'));
            } else {
                controller.processing(req)
                .then(function (result) {
                    res.send(result);
                    return next();
                })
                .catch(function (err) {
                    return next(new restify.InternalError(err.message));
                })
                .done();
            }
        } catch(ex) {
            next(new restify.InternalError(ex.message));
        }
    };
};

module.exports = {
    process: process
};