var repo = require('../../../src/repo');
var hasher = require('../../../src/model/hasher');

describe('model', function () {

    describe('users', function () {

        it('should count rows', function () {
            var userCount = repo.users.counting();
            return userCount.should.become(2);
        });

        describe('findingByName', function () {
            var finding;

            beforeEach(function () {
                finding = repo.users.findingByName('Lars');
                // finding.then(function (result) { debugger; });
            });

            it('should return the correct number of rows', function () {
                return finding.should.eventually.have.length(1);
            });

            it('should return the correct row', function () {
                return finding.should.eventually.have.deep.property('[0].name', 'Lars');
            });

            it('should include a verifiable password hash', function () {
                return finding.should.eventually.satisfy(function (usersFound) {
                    return hasher.verify('lars123', usersFound[0].passwordHash);
                });
            });

        });
    });
});