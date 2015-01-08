/* global -Promise */
var Promise = require('bluebird');
var booter = require('../../src/booter');
var repo = require('../../src/repo');
var server = require('../../src/server');

describe('booter', function () {

    beforeEach(function () {
        sandbox.stub(repo, 'connecting', Promise.method(function () { return 'dummyRepo'; }));
        sandbox.stub(server, 'starting', Promise.method(function () { return 'dummyServer'; }));
    });

    describe('booting', function () {
        var options;

        beforeEach(function () {
            options = {
                server: {},
                database: 'dbConfig'
            };
            return booter.booting(options);
        });

        it('connects to the repo', function () {
            repo.connecting.should.have.been.calledWith('dbConfig');
        });

        it('starts the server after successfully connecting to the repo', function () {
            server.starting.should.have.been.calledWith({options: options, repo: 'dummyRepo', server: 'dummyServer'});
        });
    });


});