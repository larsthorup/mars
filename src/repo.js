var Knex = require('knex');
var users = require('./model/users');

function connect(options) {
    Knex.knex = Knex.initialize(options);
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