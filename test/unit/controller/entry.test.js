/* globals -Promise */
var Promise = require('bluebird');
var entryController = require('../../../src/controller/entry');
var repo = require('../../../src/repo');
var auth = require('../../../src/auth');

describe('controller/entry', function () {

    describe('latest', function () {
        var latest;

        beforeEach(function () {
            latest = entryController.getMethod('/entry/latest', '*', 'get');
            sandbox.stub(repo.entry, 'findingLatest', function () { return Promise.resolve('someEntries'); });
        });

        it('should allow user access', function () {
            latest.authorize.should.equal(auth.user);
        });

        it('should return the entries', function () {
            return latest.processing().should.become({
                entry: 'someEntries'
            });
        });

    });

    describe('get', function () {
        var get;

        beforeEach(function () {
            get = entryController.getMethod('/entry/:id', '*', 'get');
            sandbox.stub(repo.entry, 'findingById', function () { return Promise.resolve('someEntry'); });
        });

        it('should allow user access', function () {
            get.authorize.should.equal(auth.user);
        });

        it('should return existing entry', function () {
            return get.processing({params: {id: 47}}).should.become('someEntry').then(function () {
                repo.entry.findingById.should.have.been.calledWith(47);
            });
        });

    });

    describe('patch', function () {
        var patch;

        beforeEach(function () {
            patch = entryController.getMethod('/entry/:id', '*', 'patch');
            sandbox.stub(repo.entry, 'patching', function () { return Promise.resolve({version: 3}); });
        });

        it('should allow user access', function () {
            patch.authorize.should.equal(auth.user);
        });

        it('should patch the entry', function () {
            return patch.processing({
                params: {id: 1},
                headers: {'if-match': '2'},
                body: '{"somePatchDescription": true}'
            }).should.become({
                version: 3
            }).then(function () {
                repo.entry.patching.should.have.been.calledWith(1, 2, {somePatchDescription: true});
            });
        });

    });

});