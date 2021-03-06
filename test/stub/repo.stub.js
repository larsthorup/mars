var repo = require('../../src/repo');
/* global -Promise */
var Promise = require('bluebird');

function stub(options) {

    options.sandbox.stub(repo.user, 'findingByName').callsFake(function (repo, name) {
        var users = [];
        if(name === options.user[0].name) {
            users.push({id:4711, name: options.user[0].name});
        }
        return Promise.resolve(users);
    });

    options.sandbox.stub(repo.entry, 'findingLatest').callsFake(function () {
        return Promise.resolve(options.entry);
    });

    options.sandbox.stub(repo.entry, 'findingById').callsFake(function (id) {
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
