// ToDo: use a promise library
// ToDo: promisify greet.hello

var greet = require('../../src/controller/greet');
var repo = require('../../stub/repo.stub.js');

describe('controller', function () {

    describe('greet', function () {

        describe('hello', function () {
            var res;

            beforeEach(function () {
                res = { send: sandbox.spy() };
                repo.stub({
                    users: [
                        {name: 'lars'}
                    ]
                });
            });

            it('should say hello', function (ok) {
                var req = { params: { name: 'lars' } };
                greet.hello(req, res, function (err) {
                    should.not.exist(err);
                    res.send.should.have.been.calledWith('hello lars');
                    ok();
                });
            });

            it('should refuse to say hello to putin', function (ok) {
                var req = { params: { name: 'putin' } };
                greet.hello(req, res, function (err) {
                    err.message.should.equal('does not compute: putin');
                    res.send.should.not.have.been.calledWith('hello putin');
                    ok();
                });
            });
        });
    });

});