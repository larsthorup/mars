var request = require('../../src/request');
var P = require('bluebird');

describe('request', function () {

    describe('process', function () {
        var err;
        var result;
        var controller;
        var handler;
        var res;

        beforeEach(function () {
            err = null;
            result = null;
            controller = P.method(function () {
                if(err) {
                    throw err;
                } else {
                    return result;
                }
            });
            handler = request.process(controller);
            res = { send: sandbox.spy() };
        });

        describe('when controller succeeds', function () {

            it('should send the result', function (done) {
                result = 'a good day';
                handler(null, res, function (err) {
                    should.not.exist(err);
                    res.send.should.have.been.calledWith('a good day');
                    done();
                });
            });
        });

        describe('when controller fails', function () {
            it('should fail', function (done) {
                err = new Error('no power');
                handler(null, res, function (err) {
                    err.message.should.equal('no power');
                    res.send.should.have.callCount(0);
                    done();
                });
            });
        });
    });
});