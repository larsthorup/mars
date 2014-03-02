// ToDo: raw queries
// ToDo: migrations (sql files, maybe create own framework for this)
// ToDo: make test async by returning promise

var repo = require('../../src/repo');

describe('model', function () {

    describe('users', function () {

        it('should initialize', function () {
            repo.connect();
        });

        it('should drop the schema', function (ok) {
            repo.users.droppingSchema()
            .then(function () { ok(); });
        });

        it('should create the schema', function (ok) {
            repo.users.creatingSchema()
            .then(function () { ok(); });
        });

        it('should insert rows', function (ok) {
            repo.users.creatingTestData()
            .then(function () { ok(); });
        });

        it('should count rows', function (ok) {
            repo.users.counting()
            .then(function (userCount) {
                expect(userCount).to.equal(2);
                ok();
            });
        });

        it('should select rows', function (ok) {
            repo.users.findingByName('Lars')
            .then(function (usersFound) {
                expect(usersFound).to.have.length(1);
                var lars = usersFound[0];
                expect(lars.name).to.equal('Lars');
                expect(lars.id).to.equal(1);
                ok();
            });
        });
    });
});