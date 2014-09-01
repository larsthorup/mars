var repo = require('../src/repo');
var P = require('bluebird');

function stub(options) {
    sandbox.stub(repo.users, 'findingByName', function (name) {
        var users = [];
        if(name === options.users[0].name) {
            users.push({id:4711, name: options.users[0].name});
        }
        return P.resolve(users);
    });
}

module.exports = {
    stub: stub
};