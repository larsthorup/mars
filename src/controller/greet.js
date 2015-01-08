var Controller = require('../controller');
var repo = require('../repo');
var auth = require('../auth');


var greeting = function (formatter) {
    return function greeting (req) {
        var name = req.params.name;
        return repo.user.findingByName(req.app.repo, name).then(function (users) {
            return formatter(name, users);
        });
    };
};

var methods = {
    '/hello/:name': {
        '0.1.0': {
            get: {
                authorize: auth.user,
                processing: greeting(function greetingFormatter(name, users) {
                    if (users.length < 1) {
                        throw new Error('does not compute: ' + name);
                    } else {
                        return 'hello ' + users[0].name;
                    }
                })
            }
        },
        '0.1.5': {
            get: {
                authorize: auth.user,
                processing: greeting(function greetingFormatter(name, users) {
                    if (users.length < 1) {
                        throw new Error('User not found: ' + name);
                    } else {
                        return {
                            greeting: 'hello ' + users[0].name
                        };
                    }
                })
            }
        }
    }
};
module.exports = new Controller(methods);
