// Mocha setup
var mocha = require('mocha');
require('mocha-as-promised')(); // Note: allow tests to return a promise

// Chai setup
var chai = require('chai');
global.should = chai.should();  // Note: enable the actual.should.expectation style
chai.use(require('sinon-chai')); // Note: enable sinon expectations
chai.use(require('chai-as-promised')); // Note: enable the eventually expectation

