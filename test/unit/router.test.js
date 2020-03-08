var router = require('../../src/router');
var path = require('path');
var controllers = require('require-all')(path.resolve(__dirname, '../../src', 'controller'));
var sinon = require('sinon');

describe('router', function () {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        Object.keys(controllers).forEach(function (name) {
            sandbox.stub(controllers[name], 'map');
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('map', function () {
        var server;

        beforeEach(function () {
            server = 'theServer';
            router.map(server);
        });

        it('maps controllers', function () {
            Object.keys(controllers).forEach(function (name) {
                controllers[name].map.should.have.been.calledWith('theServer');
            });
        });

    });

});
