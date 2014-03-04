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
            repo.users.droppingSchema.calledWith().should.equal(true);
            repo.users.creatingSchema.calledWith().should.equal(true);
            repo.users.creatingTestData.calledWith().should.equal(true);
        });
    });
});