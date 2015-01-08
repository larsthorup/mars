var versions = {
    '20140916095237': {
        migration: require('../../src/migrations/20140916095237_entry-version')
    }
};
var repo = require('../../src/repo');

describe('migrations', function () {

    it('starts out with latest version', function () {
        return this.repo.knex.migrate.currentVersion().should.become('20140916095237');
    });

    it('migrates entry-version down', function () {
        var repo = this.repo;
        return repo.knex.migrate.currentVersion().then(function (currentVersion) {
            // When:
            return versions[currentVersion].migration.down(repo.knex);
        }).then(function () {
            // ToDo: how to verify the version after migration?
            // Then: column deleted
            return repo.knex.schema.hasColumn('entry', 'version').should.become(false);
        }).then(function () {
            // Then: rows not deleted
            return repo.knex.from('entry').count('title as count').should.become([{count: 2}]);
        });
    });

});