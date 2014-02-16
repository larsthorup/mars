var arrayIndexOf = require('../src/util');

describe('util', function(){
    describe('arrayIndexOf', function(){
        it('should return -1 when the value is not present', function(){
            expect(arrayIndexOf([1,2,3], 5)).to.equal(-1);
            expect([1,2,3].indexOf(0)).to.equal(-1);
        });
    });
});

