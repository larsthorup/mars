// ToDo: invoke from HelloController
// ToDo: raw queries
// ToDo: migrations (sql files, maybe create own framework for this)
// ToDo: make test async by returning promise

var expect = require('chai').expect;

var users = require('../../src/model/users');

describe('model', function () {

    describe('users', function () {

        it('should initialize', function () {
            users.connect();
        });

        it('should drop the schema', function (ok) {
            users.droppingSchema()
            .then(function () { ok(); });
        });

        it('should create the schema', function (ok) {
            users.creatingSchema()
            .then(function () { ok(); });
        });

        it('should insert rows', function (ok) {
            users.creatingTestData()
            .then(function () { ok(); });
        });

        it('should select rows', function (ok) {
            users.findingByName('Lars')
            .then(function (usersFound) {
                expect(usersFound).to.have.length(1);
                var lars = usersFound[0];
                expect(lars.name).to.equal('Lars');
                expect(lars.id).to.equal(1);
                ok();
            });
        });
    });
});