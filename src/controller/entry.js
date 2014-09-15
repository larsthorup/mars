var Controller = require('../controller');
var repo = require('../repo');
var auth = require('../auth');

module.exports = new Controller({
    '/entry/latest': {
        '0.1.0': {
            get: {
                authorize: auth.user,
                processing: function latest(req) {
                    return repo.entry.findingLatest().then(function (entry) {
                        return {
                            entry: entry
                        };
                    });
                }
            }
        }
    },
    '/entry/:id': {
        '0.1.0': {
            get: {
                authorize: auth.user,
                processing: function latest(req) {
                    return repo.entry.findingById(req.params.id);
                }
            }
        }
    }

});