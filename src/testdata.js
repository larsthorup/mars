/* global -Promise */
var Promise = require('bluebird');
var path = require('path');
var models = require('require-all')(path.resolve(__dirname, 'model/'));
var hasher = require('./hasher');

function creatingUsers(repo) {
    return models.user.creating(repo, [
        {name: 'Lars', passwordHash: hasher.generate('lars123')},
        {name: 'Rob', passwordHash: hasher.generate('p')}
    ]);
}

function creatingEntries(repo) {
    return models.user.mappingByName(repo, ['Rob', 'Lars']).then(function (users) {
        return models.entry.creating(repo, [
            {title: 'More innovation', authorId: users.Rob.id, version: 1},
            {title: 'Less bureaucracy', authorId: users.Lars.id, version: 1}
        ]);
    });
}

function creating(repo) {
    return creatingUsers(repo).then(function () {
        return creatingEntries(repo);
    });
}

module.exports = {
    creating: creating
};