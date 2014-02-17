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
            expect(repo.users.droppingSchema).to.have.been.calledWith();
            expect(repo.users.creatingSchema).to.have.been.calledWith();
            expect(repo.users.creatingTestData).to.have.been.calledWith();
        });
    });
});