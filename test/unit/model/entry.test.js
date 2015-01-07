var Knex = require('knex');
var entry = require('../../../src/model/entry');


describe('model/entry', function () {
    var repo;

    beforeEach(function () {
        repo = {
            knex: Knex.knex
        };
    });


    describe('findingLatest', function () {
        var finding;

        beforeEach(function () {
            finding = entry.findingLatest(repo);
        });

        it('should return the correct rows', function () {
            return finding.should.become([
                {
                    id: 1,
                    title: 'More innovation',
                    authorName: 'Rob'
                },
                {
                    id: 2,
                    title: 'Less bureaucracy',
                    authorName: 'Lars'
                }
            ]);
        });

    });


    describe('findingById', function () {
        var finding;

        beforeEach(function () {
            finding = entry.findingById(repo, 1);
        });

        it('should return the correct rows', function () {
            return finding.should.become({
                id: 1,
                version: 1,
                title: 'More innovation',
                authorName: 'Rob'
            });
        });

    });

    describe('patching', function () {
        var patching;

        beforeEach(function () {
            patching = entry.patching(repo, 1, 1, { title: 'Less innovation!' });
        });

        it('should return the new version and update the repo', function () {
            return patching.should.become({
                version: 2
            }).then(function () {
                return entry.findingById(repo, 1).should.become({
                    id: 1,
                    version: 2,
                    title: 'Less innovation!',
                    authorName: 'Rob'
                });
            });
        });

    });

});
