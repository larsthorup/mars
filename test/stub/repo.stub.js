var repo = require('../../src/repo');
/* global -Promise */
var Promise = require('bluebird');

function stub(options) {

    sandbox.stub(repo.user, 'findingByName', function (name) {
        var users = [];
        if(name === options.user[0].name) {
            users.push({id:4711, name: options.user[0].name});
        }
        return Promise.resolve(users);
    });

    sandbox.stub(repo.entry, 'findingLatest', function () {
        return Promise.resolve(options.entry);
    });
}

module.exports = {
    stub: stub
};