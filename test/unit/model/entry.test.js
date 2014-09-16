var repo = require('../../../src/repo');

describe('model/entry', function () {

    describe('findingLatest', function () {
        var finding;

        beforeEach(function () {
            finding = repo.entry.findingLatest();
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
            finding = repo.entry.findingById(1);
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

});
