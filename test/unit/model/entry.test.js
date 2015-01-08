var entry = require('../../../src/model/entry');


describe('model/entry', function () {

    describe('findingLatest', function () {
        var finding;

        beforeEach(function () {
            finding = entry.findingLatest(this.repo);
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
            finding = entry.findingById(this.repo, 1);
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
            patching = entry.patching(this.repo, 1, 1, { title: 'Less innovation!' });
        });

        it('should return the new version and update the repo', function () {
            var testContext = this;
            return patching.should.become({
                version: 2
            }).then(function () {
                return entry.findingById(testContext.repo, 1).should.become({
                    id: 1,
                    version: 2,
                    title: 'Less innovation!',
                    authorName: 'Rob'
                });
            });
        });

    });

});
