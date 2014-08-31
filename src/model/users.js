var Knex = require('knex');
var hasher = require('./hasher');

function droppingSchema() {
    return Knex.knex.schema.dropTableIfExists('users');
}

function creatingSchema() {
    return Knex.knex.migrate.latest();
}

function creatingTestData() {
    return Knex.knex('users').insert([
        {name: 'Lars', passwordHash: hasher.generate('lars123')},
        {name: 'Rob', passwordHash: hasher.generate('p')}
    ]).then(function () {
        return counting();
    }).then(function (userCount) {
        // console.log('"users" table populated with ' + userCount + ' rows');
    });
}

function counting() {
    return Knex.knex('users').count('name as userCount').then(function (result) {
        if(result.length < 1) {
            return 0;
        } else {
            return result[0].userCount;
        }
    });
}

function findingByName(name) {
    return Knex.knex('users').where({name: name}).select();
}

module.exports = {
    droppingSchema: droppingSchema,
    creatingSchema: creatingSchema,
    creatingTestData: creatingTestData,
    findingByName: findingByName,
    counting: counting
};