var user = require('../../../src/model/user');
var hasher = require('../../../src/hasher');

describe('model/user', function () {

    it('should count rows', function () {
        var userCount = user.counting(this.repo);
        return userCount.should.become(2);
    });

    describe('findingByName', function () {
        var finding;

        beforeEach(function () {
            finding = user.findingByName(this.repo, 'Lars');
        });

        it('should return the correct number of rows', function () {
            return finding.should.eventually.have.length(1);
        });

        it('should return the correct row', function () {
            return finding.should.eventually.have.deep.property('[0].name', 'Lars');
        });

        it('should include a verifiable password hash', function () {
            return finding.should.eventually.satisfy(function (users) {
                return hasher.verify('lars123', users[0].passwordHash);
            });
        });

    });


    describe('mappingByName', function () {
        it('should return a map from name to id', function () {
            return user.mappingByName(this.repo, ['Lars', 'Rob']).should.become({
                'Lars': { id: 1 },
                'Rob': { id: 2 }
            });
        });
    });
});
