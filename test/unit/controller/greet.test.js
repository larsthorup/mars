var greet = require('../../../src/controller/greet');
var repo = require('../../../stub/repo.stub.js');
var token = require('../../../src/token');

describe('controller', function () {

    describe('greet', function () {

        describe('hello', function () {

            beforeEach(function () {
                repo.stub({
                    users: [
                        {name: 'lars'}
                    ]
                });
                sandbox.stub(token, 'authenticate', function () { return 'Lars'; });
            });

            it('should say hello', function () {
                return greet.greeting({ params: { name: 'lars' }, headers: {} }).should.become('hello lars');
            });

            it('should refuse to say hello to putin', function () {
                return greet.greeting({ params: { name: 'putin' }, headers: {} }).should.be.rejectedWith('does not compute: putin');
            });
        });
    });

});