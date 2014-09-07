var Controller = require('../../src/controller');
var request = require('../../src/request');

describe('Controller', function () {
    var controller;

    beforeEach(function () {
        controller = new Controller({
            '/some/path': {
                get: 'someMethod'
            }
        });

    });

    it('getMethod', function () {
        controller.getMethod('/some/path', 'get').should.equal('someMethod');
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
            server.get.should.have.been.calledWith('/some/path', 'theProcessFunction');
        });
    });

});