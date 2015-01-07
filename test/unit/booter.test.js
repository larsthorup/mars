/* global -Promise */
var Promise = require('bluebird');
var booter = require('../../src/booter');
var repo = require('../../src/repo');
var server = require('../../src/server');

describe('booter', function () {

    beforeEach(function () {
        sandbox.stub(repo, 'connecting', Promise.method(function () {}));
        sandbox.stub(server, 'starting');
    });

    describe('booting', function () {
        var booting;

        beforeEach(function () {
            var config = {
                server: 'serverConfig',
                database: 'dbConfig'
            };
            booting = booter.booting(config);
        });

        it('connects to the repo', function () {
            repo.connecting.should.have.been.calledWith('dbConfig');
        });

        it('starts the server after successfully connecting to the repo', function () {
            return repo.connecting.getCall(0).returnValue.then(function () {
                server.starting.should.have.been.calledWith('serverConfig');
                booting.isFulfilled().should.equal(true);
            });
        });
    });


});