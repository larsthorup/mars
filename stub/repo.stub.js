var repo = require('../src/repo');

function stub(options) {
    sandbox.stub(repo.users, 'findingByName', function (name) {
        var users = [];
        if(name === options.users[0].name) {
            users.push({id:4711, name: options.users[0].name});
        }
        return { then: function(callback) { callback(users); } };
    });
}

module.exports = {
    stub: stub
}