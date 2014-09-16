var entryController = require('../../../src/controller/entry');
var repo = require('../../stub/repo.stub.js');
var auth = require('../../../src/auth');

describe('controller/entry', function () {

    describe('latest', function () {
        var latest;

        beforeEach(function () {
            latest = entryController.getMethod('/entry/latest', '*', 'get');
            repo.stub({
                entry: [
                    {id: 1, title: 'plant trees', authorName: 'Derek'}
                ]
            });
        });

        it('should allow user access', function () {
            latest.authorize.should.equal(auth.user);
        });

        it('should return the entries', function () {
            return latest.processing().should.become({entry: [
                {id: 1, title: 'plant trees', authorName: 'Derek'}
            ]});
        });

    });

    describe('single', function () {
        var single;

        beforeEach(function () {
            single = entryController.getMethod('/entry/:id', '*', 'get');
            repo.stub({
                entry: [
                    {id: 1, version: 2, title: 'plant trees', authorName: 'Derek'}
                ]
            });
        });

        it('should allow user access', function () {
            single.authorize.should.equal(auth.user);
        });

        it('should return existing entry', function () {
            return single.processing({params: {id: 1}}).should.become({
                id: 1,
                version: 2,
                title: 'plant trees',
                authorName: 'Derek'
            });
        });

        it('should fail when entry does not exist', function () {
            return single.processing({params: {id: 2}}).should.be.rejectedWith();
        });

    });

});