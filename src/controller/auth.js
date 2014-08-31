var repo = require('../repo');
var hasher = require('../model/hasher');
var token = require('../token');

function authenticating(req) {
    // console.log(req.headers.authorization);
    // console.log(req.params);
    var userName = req.params.user;
    var password = req.params.pass;
    return repo.users.findingByName(userName)
    .then(function (users) {
        var passwordValid = false;
        var user;
        var userFound = users.length === 1;
        if(userFound) {
            user = users[0];
            passwordValid = hasher.verify(password, user.passwordHash);
        }
        if(!userFound || !passwordValid) {
            throw new Error('invalid user name or password');
        }

        return {
            token: token.create(user)
        };
    });
}

module.exports = {
    authenticating: authenticating
};
