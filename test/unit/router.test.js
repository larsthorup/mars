var router = require('../../src/router');
var authController = require('../../src/controller/auth');
var greetController = require('../../src/controller/greet');

describe('router', function () {

    beforeEach(function () {
        sandbox.stub(authController, 'map');
        sandbox.stub(greetController, 'map');
    });

    describe('map', function () {
        var server;

        beforeEach(function () {
            server = 'theServer';
            router.map(server);
        });

        it('maps controllers', function () {
            authController.map.should.have.been.calledWith('theServer');
            greetController.map.should.have.been.calledWith('theServer');
        });

    });

});