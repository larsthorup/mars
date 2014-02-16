var Knex = require('knex');
var users = require('./model/users');

function connect() {
    Knex.knex = Knex.initialize({
        client: 'sqlite3',
        connection: {
            filename: ':memory:'
        }
    });
}

function sampleData() {
    return users.droppingSchema().then(function () {
        return users.creatingSchema();
    }).then(function () {
        return users.creatingTestData();
    });
}

module.exports = {
    connect: connect,
    sampleData: sampleData,
    users: users
};