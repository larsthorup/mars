var repo = require('../../../src/repo');

describe('model', function () {

    describe('entry', function () {

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
    });
});