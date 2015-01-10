/* global -Promise */
var Promise = require('bluebird');
var bunyan = require('bunyan');
var booter = require('../../src/booter');
var repo = require('../../src/repo');
var server = require('../../src/server');

describe('booter', function () {

    beforeEach(function () {
        sandbox.stub(repo, 'connecting', Promise.method(function () { return 'dummyRepo'; }));
        sandbox.stub(server, 'starting', Promise.method(function () { return 'dummyServer'; }));
        sandbox.stub(bunyan, 'createLogger').returns('theBunyanLogger');
    });

    describe('booting', function () {
        var options;

        beforeEach(function () {
            options = {
                app: {
                    args: {
                        flags: {
                            dbRecreate: true
                        }
                    },
                    silent: true,
                },
                server: {},
                database: {
                    testdata: {}
                }
            };
            return booter.booting(options);
        });

        it('connects to the repo', function () {
            repo.connecting.should.have.been.calledWith({silent: true, testdata: { create: true}});
        });

        it('starts the server after successfully connecting to the repo', function () {
            server.starting.should.have.been.calledWith({log: 'theBunyanLogger', options: options, repo: 'dummyRepo', server: 'dummyServer'});
        });
    });


});