var repo = require('../repo.js');

function greeting(req) {
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
