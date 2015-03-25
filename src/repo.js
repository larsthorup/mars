var Knex = require('knex');
var fs = require('fs');
var mkdirp = require('mkdirp');
var assert = require('assert');
var _ = require('lodash');
var testdata = require('./testdata');
var path = require('path');
var models = require('require-all')(path.resolve(__dirname, 'model/'));
var output = require('./output');

function connecting(options) {
    if(options.testdata.create) {
        remove(options);
    }
    var knex = Knex.initialize(options);
    var repo = {
        knex: knex
    };
    return migratingLatest(repo).then(function () {
        if(!options.silent) {
            output.log('database migrated');
        }
        if(options.testdata.create) {
            return testdata.creating(repo).then(function () {
                if(!options.silent) {
                    output.log('testdata created');
                }
            });
        }
    }).then(function () {
        return repo;
    });
}

function disconnecting(repo) {
    return repo.knex.destroy();
}

function remove(options) {
    assert.equal(options.client, 'sqlite3'); // ToDo: extend to other providers
    var dbfile = options.connection.filename;
    if(fs.existsSync(dbfile)) {
        fs.unlinkSync(dbfile);
        if(!options.silent) {
            output.log('database removed');
        }
    }
    mkdirp.sync(path.dirname(dbfile));
}

function migratingLatest(repo) {
    return repo.knex.migrate.latest();
}

module.exports = _.merge(models, {
    connecting: connecting,
    disconnecting: disconnecting
});