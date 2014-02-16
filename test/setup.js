var chai = require('chai');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
chai.use(sinonChai);
global.expect = chai.expect;

beforeEach(function () {
    global.sandbox = sinon.sandbox.create();
});

afterEach(function () {
    sandbox.restore();
});