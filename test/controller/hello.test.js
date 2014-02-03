var assert = require('assert');
var controller = require('../../src/controller/hello.js');
var sinon = require('sinon');

describe('hello controller', function () {
    var res;

    before(function () {
        res = { send: sinon.spy() };
    })

    it('should say hello', function (ok) {
        var req = { params: { name: 'lars' } };
        controller.hello(req, res, function () {
            assert.ok(res.send.calledWith('hello lars'));
            ok();
        });
    })

    it('should refuse to say hello to putin', function (ok) {
        var req = { params: { name: 'putin' } };
        controller.hello(req, res, function () {
            assert.ok(!res.send.calledWith('hello putin'));
            ok();
        });
    })

})