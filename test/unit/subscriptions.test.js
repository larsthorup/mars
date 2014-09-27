var Subscriptions = require('../../src/subscriptions').Subscriptions;

describe('subscriptions', function () {
    var subscriptions;

    beforeEach(function () {
        subscriptions = new Subscriptions();
        subscriptions.subscribe('clientA', 'pathA');
        subscriptions.subscribe('clientB', 'pathB');
        subscriptions.subscribe('clientA', 'pathB');
    });

    describe('getClients', function () {

        it('should return those clients', function () {
            subscriptions.getClients('pathA').should.deep.equal(['clientA']);
            subscriptions.getClients('pathB').should.deep.equal(['clientB', 'clientA']);
        });

        it('should return an empty array when no subscriptions for client', function () {
            subscriptions.getClients('pathC').should.deep.equal([]);
        });

    });

    describe('getPaths', function () {

        it('should return those paths', function () {
            subscriptions.getPaths('clientA').should.deep.equal(['pathA', 'pathB']);
            subscriptions.getPaths('clientB').should.deep.equal(['pathB']);
        });

        it('should return an empty array when no subscriptions for path', function () {
            subscriptions.getPaths('clientC').should.deep.equal([]);
        });
    });

    describe('unsubscribe', function () {

        beforeEach(function () {
            subscriptions.unsubscribe('clientB', 'pathB');
        });

        it('should no longer return that path', function () {
            subscriptions.getPaths('clientB').should.deep.equal([]);
        });

        it('should no longer return that client', function () {
            subscriptions.getClients('pathB').should.deep.equal(['clientA']);
        });
    });

    describe('unsubscribeClient', function () {

        beforeEach(function () {
            subscriptions.unsubscribeClient('clientA');
        });

        it('should no longer return that client for any path', function () {
            subscriptions.getClients('pathA').should.deep.equal([]);
            subscriptions.getClients('pathB').should.deep.equal(['clientB']);
        });

    });

});