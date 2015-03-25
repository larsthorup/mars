module.exports = function () {
    return {
        testFramework: 'mocha@2.1.0',
        files: [
            'src/**/*.js',
            'test/**/*.js',
            {pattern: 'test/unit/**/*.test.js', ignore: true},
        ],
        tests: [
            'test/unit/**/*.test.js'
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        workers: {
            recycle: true
        },
        bootstrap: function (wallaby) {
            // Note: copied from test/unit/setup.js
            var chai = require('chai');
            global.should = chai.should();  // Note: enable the actual.should.expectation style
            chai.use(require('sinon-chai')); // Note: enable sinon expectations
            chai.use(require('chai-as-promised')); // Note: enable the eventually expectation
        }
    };
};