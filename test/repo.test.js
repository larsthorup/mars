// ToDo: simplify promising stubs

var expect = require('chai').expect;
var sinon = require('sinon');

var repo = require('../src/repo');

describe('repo', function () {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('sampleData', function () {

        beforeEach(function () {
        });

        it('intializes schema and test data', function () {
            sandbox.stub(repo.users, 'droppingSchema', function () { return { then: function (callback) { return callback();}};});
            sandbox.stub(repo.users, 'creatingSchema', function () { return { then: function (callback) { return callback();}};});
            sandbox.stub(repo.users, 'creatingTestData');

            repo.sampleData();

            expect(repo.users.droppingSchema).to.have.been.calledWith();
            expect(repo.users.creatingSchema).to.have.been.calledWith();
            expect(repo.users.creatingTestData).to.have.been.calledWith();
        });
    });
});