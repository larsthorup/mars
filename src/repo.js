var Knex = require('knex');
var fs = require('fs');
var assert = require('assert');
var testdata = require('./model/testdata');

function connecting(options) {
    if(options.testdata.create) {
        recreate(options);
    }
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

function recreate(options) {
    assert.equal(options.client, 'sqlite3'); // ToDo: extend to other providers
    var dbfile = options.connection.filename;
    if(fs.existsSync(dbfile)) {
        fs.unlinkSync(dbfile);
    }
}

function migrateLatest() {
    return Knex.knex.migrate.latest();
}

module.exports = {
    connecting: connecting,
    disconnecting: disconnecting,
    // ToDo: use requireAll
    user: require('./model/user'),
    entry: require('./model/entry')
};