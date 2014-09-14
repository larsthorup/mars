var Knex = require('knex');
var hasher = require('./../hasher');

function creatingTestData() {
    return Knex.knex('user').insert([
        {name: 'Lars', passwordHash: hasher.generate('lars123')},
        {name: 'Rob', passwordHash: hasher.generate('p')}
    ]);
}

function counting() {
    return Knex.knex('user').count('name as userCount').then(function (result) {
        if(result.length < 1) {
            return 0;
        } else {
            return result[0].userCount;
        }
    });
}

function findingByName(name) {
    return Knex.knex('user').where({name: name}).select();
}

function mappingByName(names) {
    return Knex.knex('user').where('name', 'in', names).select().then(function (users) {
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