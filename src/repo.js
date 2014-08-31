var Knex = require('knex');
var testdata = require('./model/testdata');
var users = require('./model/users');

function connecting(options) {
    Knex.knex = Knex.initialize(options);
    return migrateLatest().then(function () {
        if(options.testdata.create) {
            return testdata.creating();
        }
    });
}

function disconnecting() {
    return Knex.knex.destroy();
}

function migrateLatest() {
    return Knex.knex.migrate.latest();
}

module.exports = {
    connecting: connecting,
    disconnecting: disconnecting,
    users: users
};