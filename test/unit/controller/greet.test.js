var greet = require('../../../src/controller/greet');
var repo = require('../../../stub/repo.stub.js');

describe('controller', function () {

    describe('greet', function () {

        describe('hello', function () {

            beforeEach(function () {
                repo.stub({
                    users: [
                        {name: 'lars'}
                    ]
                });
            });

            it('should say hello', function () {
                return greet.greeting({ params: { name: 'lars' } }).should.become('hello lars');
            });

            it('should refuse to say hello to putin', function () {
                return greet.greeting({ params: { name: 'putin' } }).should.be.rejectedWith('does not compute: putin');
            });
        });
    });

});