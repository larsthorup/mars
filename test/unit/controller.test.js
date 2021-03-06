var Controller = require('../../src/controller');
var request = require('../../src/request');
var semver = require('semver');
var sinon = require('sinon');
var restify = require('restify');

describe('Controller', function () {
    var sandbox;
    var controller;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        controller = new Controller({
            '/some/path': {
                '2.4.1': {
                    get: 'someMethod'
                }
            }
        });

    });

    afterEach(function () {
        sandbox.restore();
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
            sandbox.stub(restify.plugins, 'conditionalHandler').returns('theConditionalHandler');
            controller.map(server);
        });

        it('map all methods', function () {
            request.process.should.have.been.calledWith('someMethod');
            server.get.should.have.been.calledWith('/some/path', 'theConditionalHandler');
            restify.plugins.conditionalHandler.should.have.been.calledWith([
                {version: '2.4.1', handler: 'theProcessFunction'}
            ]);
        });
    });

});
