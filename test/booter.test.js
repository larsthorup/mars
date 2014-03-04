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
            repo.connect.calledWith().should.equal(true);
        });

        it('creates sample data', function () {
            repo.sampleData.calledWith().should.equal(true);
        });

        it('starts the server', function () {
            server.start.calledWith('serverConfig').should.equal(true);
        });
    });


});