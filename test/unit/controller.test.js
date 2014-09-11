var Controller = require('../../src/controller');
var request = require('../../src/request');
var semver = require('semver');

describe('Controller', function () {
    var controller;

    beforeEach(function () {
        controller = new Controller({
            '/some/path': {
                '2.4.1': {
                    get: 'someMethod'
                }
            }
        });

    });

    it('getMethod', function () {
        controller.getMethod('/some/path', '^2.3.0', 'get').should.equal('someMethod');
    });

    it('getMethod, fails because no version available', function () {
        should.throw(function () { controller.getMethod('/some/path', '^1.0.0', 'get'); }, 'No match for version ^1.0.0 of method /some/path');
    });

    describe('map', function () {
        var server;

        beforeEach(function () {
            server = {
                get: sandbox.spy()
            };
            sandbox.stub(request, 'process').returns('theProcessFunction');
            controller.map(server);
        });

        it('map all methods', function () {
            request.process.should.have.been.calledWith('someMethod');
            server.get.should.have.been.calledWith({path: '/some/path', version: '2.4.1'}, 'theProcessFunction');
        });
    });

});