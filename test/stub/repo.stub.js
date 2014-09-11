var repo = require('../../src/repo');
/* global -Promise */
var Promise = require('bluebird');

function stub(options) {
    sandbox.stub(repo.users, 'findingByName', function (name) {
        var users = [];
        if(name === options.users[0].name) {
            users.push({id:4711, name: options.users[0].name});
        }
        return Promise.resolve(users);
    });
}

module.exports = {
    stub: stub
};