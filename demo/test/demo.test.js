describe('demo', function () {
    it('should concatenate strings', function () {
        ('ab' + 'cd').should.equal('abcd');
    });
    it('should support Promise', function () {
        (typeof Promise).should.equal('function');
    });
});