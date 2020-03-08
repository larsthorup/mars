var versions = {
    '20140916095237': {
        migration: require('../../src/migrations/20140916095237_entry-version')
    }
};
var repo = require('../../src/repo');
var schema = require('./schema');

describe('migrations', function () {

    beforeEach(function () {
        var testContext = this;
        return repo.connecting(schema.options).then(function (repo) {
            testContext.repo = repo;
        });
    });

    afterEach(function () {
        return repo.disconnecting(this.repo);
    });

    it('starts out with latest version', function () {
        return this.repo.knex.migrate.currentVersion().should.become('20140916095237');
    });

    it('migrates entry-version down', function () {
        var repo = this.repo;
        return repo.knex.migrate.currentVersion().then(function (currentVersion) {
            // When:
            return versions[currentVersion].migration.down(repo.knex);
        }).then(function () {
            // ToDo: how to verify the version after migration, since we are just running our own migration.down function, not using the Knex Migrator, so it actually doesn't know about it...
            // Then: column deleted
            return repo.knex.schema.hasColumn('entry', 'version').should.become(false);
        }).then(function () {
            // Then: rows not deleted
            return repo.knex.from('entry').count('title as count').should.become([{count: 2}]);
        });
    });

});
