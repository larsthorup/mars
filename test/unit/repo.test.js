/* globals -Promise */
var Promise = require('bluebird');
var Knex = require('knex');
var fs = require('fs');
var mkdirp = require('mkdirp');
var repo = require('../../src/repo');
var testdata = require('../../src/testdata');
var output = require('../../src/output');
var sinon = require('sinon');
var path = require('path');

describe('repo', function () {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
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
            sandbox.stub(repo, 'initializeKnex').callsFake(function () { return knex; });
            sandbox.stub(fs, 'existsSync').callsFake(function () { return true; });
            sandbox.stub(fs, 'unlinkSync');
            sandbox.stub(mkdirp, 'sync');
            sandbox.stub(testdata, 'creating').callsFake(function () { return Promise.resolve(); });
            sandbox.stub(output, 'log');
            return repo.connecting({
                silent: false,
                client: 'sqlite3',
                connection: {
                    filename: 'dbFileName'
                },
                useNullAsDefault: true,
                migrations: {
                    directory: path.resolve(__dirname, '../../src/migrations')
                },
                testdata: {
                    create: true
                }
            });
        });

        it('should remove the database', function () {
            fs.unlinkSync.should.have.been.calledWith('dbFileName');
            output.log.should.have.been.calledWith('database removed');
        });

        it('should create the parent directories', function () {
            // mkdirp.sync.should.have.been.calledWith('dbDir');
        });

        it('should migrate', function () {
            // knex.migrate.latest.should.have.been.called();
            output.log.should.have.been.calledWith('database migrated');
        });

        it('should create test data', function () {
            testdata.creating.callCount.should.equal(1);
            output.log.should.have.been.calledWith('testdata created');
        });

    });

});
