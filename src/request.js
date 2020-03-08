var errors = require('restify-errors');

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
                });
            }
        } catch(ex) {
            next(new errors.InternalError(ex.message));
        }
    };
};

module.exports = {
    process: process
};
