var repo = require('../src/repo');
var P = require('bluebird');

describe('repo', function () {

    beforeEach(function () {
        sandbox.stub(repo.users, 'droppingSchema', function () { return P.resolve();});
        sandbox.stub(repo.users, 'creatingSchema', function () { return P.resolve();});
        sandbox.stub(repo.users, 'creatingTestData');
    });

    describe('sampleData', function () {

        beforeEach(function () {
            return repo.sampleData();
        });

        it('intializes schema and test data', function () {
            repo.users.droppingSchema.should.have.been.calledWith();
            repo.users.creatingSchema.should.have.been.calledWith();
            repo.users.creatingTestData.should.have.been.calledWith();
        });
    });
});