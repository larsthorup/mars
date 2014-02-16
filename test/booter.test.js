var expect = require('chai').expect;
var sinon = require('sinon');

var booter = require('../src/booter');
var repo = require('../src/repo');
var server = require('../src/server');

describe('booter', function () {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        sandbox.stub(repo, 'connect');
        sandbox.stub(repo, 'sampleData', function () { return { then: function (callback) { return callback();}};})
        sandbox.stub(server, 'start');
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('boot', function () {

        beforeEach(function () {
            booter.boot();
        });

        it('connects to the repo', function () {
            expect(repo.connect).to.have.been.calledWith();
        });

        it('creates sample data', function () {
            expect(repo.sampleData).to.have.been.calledWith();
        });

        it('starts the server', function () {
            expect(server.start).to.have.been.calledWith();
        });
    });


});