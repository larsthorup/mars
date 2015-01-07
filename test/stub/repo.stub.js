var repo = require('../../src/repo');
/* global -Promise */
var Promise = require('bluebird');

function stub(options) {

    sandbox.stub(repo.user, 'findingByName', function (repo, name) {
        var users = [];
        if(name === options.user[0].name) {
            users.push({id:4711, name: options.user[0].name});
        }
        return Promise.resolve(users);
    });

    sandbox.stub(repo.entry, 'findingLatest', function () {
        return Promise.resolve(options.entry);
    });

    sandbox.stub(repo.entry, 'findingById', function (id) {
        var entries = options.entry.filter(function (entry) { return entry.id === id; });
        if(entries.length === 1) {
            return Promise.resolve(entries[0]);
        } else {
            return Promise.reject();
        }
    });
}

module.exports = {
    stub: stub
};