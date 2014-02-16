// ToDo: use a promise library
// ToDo: repoStub

var expect = require('chai').expect;
var sinon = require('sinon');

var greet = require('../../src/controller/greet.js');
var users = require('../../src/model/users.js');

describe('greet', function () {

    describe('hello', function () {
        var res;
        var sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            res = { send: sandbox.spy() };
            sandbox.stub(users, 'findingByName', function (name) {
                var users = [];
                if(name == 'lars') users.push({id:4711, name: 'lars'});
                return { then: function(callback) { callback(users); } };
            });
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should say hello', function (ok) {
            var req = { params: { name: 'lars' } };
            greet.hello(req, res, function (err) {
                expect(err).to.equal(undefined);
                expect(res.send).to.have.been.calledWith('hello lars');
                ok();
            });
        });

        it('should refuse to say hello to putin', function (ok) {
            var req = { params: { name: 'putin' } };
            greet.hello(req, res, function (err) {
                expect(err.message).to.equal('does not compute');
                expect(res.send).not.to.have.been.calledWith('hello putin');
                ok();
            });
        });
    });
});