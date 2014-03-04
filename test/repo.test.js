// ToDo: simplify promising stubs

var repo = require('../src/repo');

describe('repo', function () {

    beforeEach(function () {
        sandbox.stub(repo.users, 'droppingSchema', function () { return { then: function (callback) { return callback();}};});
        sandbox.stub(repo.users, 'creatingSchema', function () { return { then: function (callback) { return callback();}};});
        sandbox.stub(repo.users, 'creatingTestData');
    });

    describe('sampleData', function () {

        beforeEach(function () {
            repo.sampleData();
        });

        it('intializes schema and test data', function () {
            repo.users.droppingSchema.should.have.been.calledWith();
            repo.users.creatingSchema.should.have.been.calledWith();
            repo.users.creatingTestData.should.have.been.calledWith();
        });
    });
});