var booter = require('../../src/booter');
var repo = require('../../src/repo');
var server = require('../../src/server');

describe('booter', function () {

    beforeEach(function () {
        sandbox.stub(repo, 'connect');
        sandbox.stub(repo, 'sampleData', function () { return { then: function (callback) { return callback();}};});
        sandbox.stub(server, 'start');
    });

    describe('boot', function () {

        beforeEach(function () {
            var config = {
                server: 'serverConfig',
                database: 'dbConfig'
            };
            booter.boot(config);
        });

        it('connects to the repo', function () {
            repo.connect.should.have.been.calledWith('dbConfig');
        });

        it('creates sample data', function () {
            repo.sampleData.should.have.been.calledWith();
        });

        it('starts the server', function () {
            server.start.should.have.been.calledWith('serverConfig');
        });
    });


});