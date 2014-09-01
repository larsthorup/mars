var repo = require('../repo');
var token = require('../token');

function greeting(req) {

    // ToDo: extract
    var userName = token.authenticate(req.headers.authorization);
    if(!userName) {
        throw new Error('not authorized');
    }

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

module.exports = {
    greeting: greeting
};
