var arrayIndexOf = require('../../src/util');

describe('util', function(){
    describe('arrayIndexOf', function(){
        it('should return -1 when the value is not present', function(){
            arrayIndexOf([1,2,3], 5).should.equal(-1);
            [1,2,3].indexOf(0).should.equal(-1);
        });
    });
});

