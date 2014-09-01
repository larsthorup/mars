// Mocha setup
require('mocha');

// Chai setup
var chai = require('chai');
global.should = chai.should();  // Note: enable the actual.should.expectation style
chai.use(require('sinon-chai')); // Note: enable sinon expectations
chai.use(require('chai-as-promised')); // Note: enable the eventually expectation

