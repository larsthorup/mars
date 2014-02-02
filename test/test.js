var assert = require('assert');
var arrayIndexOf = require('../src/code');

describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, arrayIndexOf([1,2,3], 5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});