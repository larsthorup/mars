var repo = require('../repo.js');

function authenticating(req) {
    // console.log(req.headers.authorization);
    // console.log(req.params);
    var userName = req.params.user;
    return repo.users.findingByName(userName)
    .then(function (users) {
        if(users.length < 1) {
            throw new Error('invalid user name or password');
        } else {
            return {
                token: 'secret'
            };
        }
    });
}

module.exports = {
    authenticating: authenticating
};
