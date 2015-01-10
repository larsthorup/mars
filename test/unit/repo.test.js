/* globals -Promise */
var Promise = require('bluebird');
var Knex = require('knex');
var fs = require('fs');
var repo = require('../../src/repo');
var testdata = require('../../src/testdata');

describe('repo', function () {

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
            sandbox.stub(testdata, 'creating', function () { return Promise.resolve(); });
            sandbox.stub(console, 'log');
            return repo.connecting({
                silent: false,
                client: 'sqlite3',
                connection: {
                    filename: 'dbFileName'
                },
                testdata: {
                    create: true
                }
            });
        });

        it('should remove the database', function () {
            fs.unlinkSync.should.have.been.calledWith('dbFileName');
            console.log.should.have.been.calledWith('database removed');
        });

        it('should migrate', function () {
            knex.migrate.latest.should.have.been.calledWith();
            console.log.should.have.been.calledWith('database migrated');
        });

        it('should create test data', function () {
            testdata.creating.should.have.been.calledWith({knex: knex});
            console.log.should.have.been.calledWith('testdata created');
        });

    });

});