var Knex = require('knex');

function droppingSchema() {
    return Knex.knex.schema.dropTableIfExists('users');
}

function creatingSchema() {
    return Knex.knex.schema.createTable('users', function(table) {
        table.increments('id');
        table.string('name');
    });
}

function creatingTestData() {
    return Knex.knex('users').insert([
        {name: 'Lars'},
        {name: 'Rob'}
    ]);
}

function findingByName(name) {
    return Knex.knex('users').where({name: name}).select();
}

module.exports = {
    droppingSchema: droppingSchema,
    creatingSchema: creatingSchema,
    creatingTestData: creatingTestData,
    findingByName: findingByName
};