// ToDo: extract into UserRepository
// ToDo: invoke from HelloController
// ToDo: make test async by returning promise
// ToDo: raw queries
// ToDo: migrations

var expect = require('chai').expect;

var Knex = require('knex');

describe('model', function () {

    describe('user', function () {
        var knex;

        it('should initialize', function () {
            knex = Knex.initialize({
                client: 'sqlite3',
                connection: {
                    filename: ':memory:'
                }
            });
        });

        it('should drop the schema', function (ok) {
            knex.schema.dropTableIfExists('users')
            .then(function () { ok(); })
        })

        it('should create the schema', function (ok) {
            knex.schema.createTable('users', function(table) {
                table.increments('id');
                table.string('name');
            })
            .then(function () { ok(); })
        })

        it('should insert rows', function (ok) {
            knex('users').insert([
                {name: 'Lars'},
                {name: 'Rob'}
            ])
            .then(function () { ok(); })
        })

        it('should select rows', function (ok) {
            knex('users').where({name: 'Lars'}).select()
            .then(function (users) {
                expect(users).to.have.length(1);
                var lars = users[0];
                expect(lars.name).to.equal('Lars');
                expect(lars.id).to.equal(1);
                ok();
            })
        })
    });
});