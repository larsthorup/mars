var Knex = require('knex');
var user = require('./user');
var assert = require('assert');

function creatingTestData() {
    return user.mappingByName(['Rob', 'Lars']).then(function (users) {
        return Knex.knex('entry').insert([
            {title: 'More innovation', authorId: users.Rob.id, version: 1},
            {title: 'Less bureaucracy', authorId: users.Lars.id, version: 1}
        ]);
    });
}

function findingLatest() {
    // ToDo: order by lastModified
    // ToDo: configurable limit
    return Knex.knex.from('entry')
    .innerJoin('user', 'entry.authorId', 'user.id')
    .select(['entry.id as id', 'title', 'user.name as authorName'])
    .orderBy('user.id', 'desc')
    .limit(10);
}

function findingById(id) {
    return Knex.knex.from('entry')
    .innerJoin('user', 'entry.authorId', 'user.id')
    .first(['entry.id as id', 'entry.version', 'title', 'user.name as authorName'])
    .where({'entry.id': id});
}

function patching(id, version, patch) {
    // ToDo: use json patch?
    var newVersion = version + 1;
    patch.version = newVersion;
    return Knex.knex.table('entry')
    .where({id: id, version: version})
    .update(patch)
    .then(function (rowCount) {
        if(rowCount === 1) {
            return {
                version: newVersion
            };
        } else {
            throw new Error('Invalid version');
        }
    })
    .catch(function (err) {
        // ToDo: use bunyan
        console.log('Failed to patch', id, version, patch, err);
        throw err;
    });
}

module.exports = {
    creatingTestData: creatingTestData,
    findingLatest: findingLatest,
    findingById: findingById,
    patching: patching
};