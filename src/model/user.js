var Knex = require('knex');
var hasher = require('./../hasher');

function creatingTestData(repo) {
    return repo.knex('user').insert([
        {name: 'Lars', passwordHash: hasher.generate('lars123')},
        {name: 'Rob', passwordHash: hasher.generate('p')}
    ]);
}

function counting(repo) {
    return repo.knex('user').count('name as userCount').then(function (result) {
        if(result.length < 1) {
            return 0;
        } else {
            return result[0].userCount;
        }
    });
}

function findingByName(repo, name) {
    return repo.knex('user').where({name: name}).select();
}

function mappingByName(repo, names) {
    return repo.knex('user').where('name', 'in', names).select().then(function (users) {
        var map = {};
        users.forEach(function (user) {
            map[user.name] = { id: user.id };
        });
        return map;
    });
}

module.exports = {
    creatingTestData: creatingTestData,
    findingByName: findingByName,
    counting: counting,
    mappingByName: mappingByName
};