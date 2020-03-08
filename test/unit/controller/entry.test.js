/* globals -Promise */
var Promise = require('bluebird');

var entryController = require('../../../src/controller/entry');

var auth = require('../../../src/auth');
var clients = require('../../../src/clients');
var repo = require('../../../src/repo');
var sinon = require('sinon');

describe('controller/entry', function () {
    var sandbox;
    var app;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        app = {
            repo: 'dummyRepo'
        };
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('latest', function () {
        var latest;

        beforeEach(function () {
            latest = entryController.getMethod('latest', '*', 'get');
            sandbox.stub(repo.entry, 'findingLatest').callsFake(function () { return Promise.resolve('someEntries'); });
        });

        it('should allow user access', function () {
            latest.authorize.should.equal(auth.user);
        });

        it('should return the entries', function () {
            return latest.processing({app: app}).should.become({
                entry: 'someEntries'
            });
        });

    });

    describe('get', function () {
        var get;

        beforeEach(function () {
            get = entryController.getMethod(':id', '*', 'get');
            sandbox.stub(repo.entry, 'findingById').callsFake(function () { return Promise.resolve('someEntry'); });
        });

        it('should allow user access', function () {
            get.authorize.should.equal(auth.user);
        });

        it('should return existing entry', function () {
            return get.processing({params: {id: 47}, app: app}).should.become('someEntry').then(function () {
                repo.entry.findingById.should.have.been.calledWith('dummyRepo', 47);
            });
        });

    });

    describe('patch', function () {
        var patch;

        beforeEach(function () {
            patch = entryController.getMethod(':id', '*', 'patch');
            sandbox.stub(repo.entry, 'patching').callsFake(function () { return Promise.resolve({version: 3}); });
            app.clients = {
                notifyPatch: sandbox.spy()
            };
        });

        it('should allow user access', function () {
            patch.authorize.should.equal(auth.user);
        });

        it('should patch the entry', function () {
            return patch.processing({
                url: '/entry/1',
                params: {id: 1},
                headers: {'if-match': '2'},
                body: {somePatchDescription: true},
                app: app
            }).should.become({
                version: 3
            }).then(function () {
                return repo.entry.patching.should.have.been.calledWith('dummyRepo', 1, 2, {somePatchDescription: true});
            }).then(function () {
                return app.clients.notifyPatch.should.have.been.calledWith({
                    path: '/entry/1',
                    fromVersion: '2',
                    toVersion: '3',
                    patch: {somePatchDescription: true}
                });
            });
        });

    });

});
