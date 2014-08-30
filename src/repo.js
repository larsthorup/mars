var Knex = require('knex');
var users = require('./model/users');

function connect(options) {
    Knex.knex = Knex.initialize(options);
}

function disconnecting() {
    return Knex.knex.destroy();
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
    disconnecting: disconnecting,
    sampleData: sampleData,
    users: users
};