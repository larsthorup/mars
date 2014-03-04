var repo = require('../../src/repo');
// var hasher = require('../../src/model/hasher');

describe('model', function () {

    describe('users', function () {

        it('should initialize', function () {
            repo.connect();
        });

        it('should drop the schema', function () {
            return repo.users.droppingSchema();
        });

        it('should create the schema', function () {
            return repo.users.creatingSchema();
        });

        it('should insert rows', function () {
            return repo.users.creatingTestData();
        });

        it('should count rows', function () {
            var userCount = repo.users.counting();
            return userCount.should.become(2);
        });

        it('should select rows', function () {
            var finding = repo.users.findingByName('Lars');
            // finding.then(function (result) { debugger; });
            return finding.should.eventually.have.length(1);
//            return finding.should.eventually.satisfy(function (usersFound) {
//                return usersFound.length === 1 &&
//                usersFound[0].name === 'Lars' &&
//                usersFound[0].id === 1 &&
//                hasher.verify('lars123x', usersFound[0].passwordHash);
//            });
        });
    });
});