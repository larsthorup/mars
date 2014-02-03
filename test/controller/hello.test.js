// ToDo: move test framework setup to a common file
var chai = require('chai');
var expect = chai.expect;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var sinon = require('sinon');

var controller = require('../../src/controller/hello.js');

describe('hello controller', function () {
    var res;

    before(function () {
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