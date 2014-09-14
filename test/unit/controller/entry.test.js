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

        it('should say hello', function () {
            return latest.processing().should.become({entry: [
                {id: 1, title: 'plant trees', authorName: 'Derek'}
            ]});
        });

    });

});