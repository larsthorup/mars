/* globals -Promise */
var Promise = require('bluebird');
var Knex = require('knex');
var fs = require('fs');
var mkdirp = require('mkdirp');
var repo = require('../../src/repo');
var testdata = require('../../src/testdata');
var output = require('../../src/output');
var sinon = require('sinon');

describe('repo', function () {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('connecting', function () {
        var knex;

        beforeEach(function () {
            knex = {
                migrate: {
                    latest: sandbox.spy(function () { return Promise.resolve(); })
                }
            };
            sandbox.stub(Knex, 'initialize', function () { return knex; });
            sandbox.stub(fs, 'existsSync', function () { return true; });
            sandbox.stub(fs, 'unlinkSync');
            sandbox.stub(mkdirp, 'sync');
            sandbox.stub(testdata, 'creating', function () { return Promise.resolve(); });
            sandbox.stub(output, 'log');
            return repo.connecting({
                silent: false,
                client: 'sqlite3',
                connection: {
                    filename: 'dbDir/dbFileName'
                },
                testdata: {
                    create: true
                }
            });
        });

        it('should remove the database', function () {
            fs.unlinkSync.should.have.been.calledWith('dbDir/dbFileName');
            output.log.should.have.been.calledWith('database removed');
        });

        it('should create the parent directories', function () {
            mkdirp.sync.should.have.been.calledWith('dbDir');
        });

        it('should migrate', function () {
            knex.migrate.latest.should.have.been.calledWith();
            output.log.should.have.been.calledWith('database migrated');
        });

        it('should create test data', function () {
            testdata.creating.should.have.been.calledWith({knex: knex});
            output.log.should.have.been.calledWith('testdata created');
        });

    });

});