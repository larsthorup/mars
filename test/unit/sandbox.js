var sinon = require('sinon');

beforeEach(function () {
    global.sandbox = sinon.sandbox.create();
});

afterEach(function () {
    global.sandbox.restore();
});

