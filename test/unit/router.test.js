var router = require('../../src/router');

describe('router', function () {
    var server;

    beforeEach(function () {
        server = {
            get: sandbox.spy(),
            head: sandbox.spy(),
            post: sandbox.spy()
        };
    });

    describe('map', function () {

        beforeEach(function () {
            router.map(server);
        });

        it('maps hello', function () {
            server.get.should.have.been.calledWith('/hello/:name', router.hello);
        });

        it('maps authenticate', function () {
            server.post.should.have.been.calledWith('/auth/authenticate/:user', router.authenticate);
        });

    });

});