var Knex = require('knex');
var user = require('./user');

function creatingTestData() {
    return user.mappingByName(['Rob', 'Lars']).then(function (users) {
        return Knex.knex('entry').insert([
            {title: 'More innovation', authorId: users.Rob.id},
            {title: 'Less bureaucracy', authorId: users.Lars.id}
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
    .first(['entry.id as id', 'title', 'user.name as authorName'])
    .where({'entry.id': id});
}

module.exports = {
    creatingTestData: creatingTestData,
    findingLatest: findingLatest,
    findingById: findingById
};