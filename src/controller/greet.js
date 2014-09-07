var Controller = require('../controller');
var repo = require('../repo');
var auth = require('../auth');

module.exports = new Controller({
    '/hello/:name': {
        get: {
            authorize: auth.user,
            processing: function greeting(req) {
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
        }
    }
});
