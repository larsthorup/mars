var Knex = require('knex');
var versions = {
    '20140916095237': {
        migration: require('../../src/migrations/20140916095237_entry-version')
    }
};
var latestVersion = '20140916095237';
var repo = require('../../src/repo');
var schema = require('./schema');

describe('migrations', function () {
    var currentVersion;

    before(function () {
        return Knex.knex.migrate.currentVersion().then(function (version) {
            currentVersion = version;
        });
    });

    after(function () {
        // Note: recreate the schema and test data
        return repo.disconnecting().then(function () {
            return repo.connecting(schema.options);
        });
    });

    it('starts out with latest version', function () {
        currentVersion.should.equal('20140916095237');
    });

    it('migrates entry-version down', function () {
        return versions[currentVersion].migration.down(Knex.knex).then(function () {
            return Knex.knex.schema.hasColumn('entry', 'version').should.become(false);
        }).then(function () {
            // ToDo: figure out why our test data got deleted...
            return Knex.knex.from('entry').count('title as count').should.become([{count: 0}]);
        }).then(function () {
            return Knex.knex.migrate.currentVersion();
        }).then(function (version) {
            currentVersion = version;
        });
    });

});