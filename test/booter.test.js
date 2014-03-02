var booter = require('../src/booter');
var repo = require('../src/repo');
var server = require('../src/server');

describe('booter', function () {

    beforeEach(function () {
        sandbox.stub(repo, 'connect');
        sandbox.stub(repo, 'sampleData', function () { return { then: function (callback) { return callback();}};});
        sandbox.stub(server, 'start');
    });

    describe('boot', function () {

        beforeEach(function () {
            booter.boot({server: 'serverConfig'});
        });

        it('connects to the repo', function () {
            expect(repo.connect).to.have.been.calledWith();
        });

        it('creates sample data', function () {
            expect(repo.sampleData).to.have.been.calledWith();
        });

        it('starts the server', function () {
            expect(server.start).to.have.been.calledWith('serverConfig');
        });
    });


});