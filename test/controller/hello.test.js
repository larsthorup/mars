var expect = require('chai').expect;
var sinon = require('sinon');

var controller = require('../../src/controller/hello.js');

describe('controller', function () {

    describe('hello', function () {
        var res;

        beforeEach(function () {
            res = { send: sinon.spy() };
        })

        it('should say hello', function (ok) {
            var req = { params: { name: 'lars' } };
            controller.hello(req, res, function (err) {
                expect(err).to.be.undefined;
                expect(res.send).to.have.been.calledWith('hello lars');
                ok();
            });
        })

        it('should refuse to say hello to putin', function (ok) {
            var req = { params: { name: 'putin' } };
            controller.hello(req, res, function (err) {
                expect(err.message).to.equal('does not compute');
                expect(res.send).not.to.have.been.calledWith('hello putin');
                ok();
            });
        })
    })
})