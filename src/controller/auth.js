var Controller = require('../controller');
var repo = require('../repo');
var hasher = require('../hasher');
var token = require('../token');
var auth = require('../auth');

module.exports = new Controller({
    'authenticate/:user': {
        '0.1.0': {
            post: {
                authorize: auth.anyone,
                processing: function authenticating (req) {
                    var userName = req.params.user;
                    var password = req.body.pass;
                    return repo.user.findingByName(req.app.repo, userName)
                    .then(function (users) {
                        var passwordValid = false;
                        var user;
                        var userFound = users.length === 1;
                        if (userFound) {
                            user = users[0];
                            passwordValid = hasher.verify(password, user.passwordHash);
                        }
                        if (!userFound || !passwordValid) {
                            throw new Error('invalid user name or password');
                        }

                        return {
                            token: token.create(user)
                        };
                    });
                }
            }
        }
    }
});
