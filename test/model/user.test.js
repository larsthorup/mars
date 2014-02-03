// ToDo: make test async by returning promise
// ToDo: expect() instead of assert()
// ToDo: raw queries
// ToDo: migrations

var assert = require('assert');
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
                assert.equal(1, users.length);
                var lars = users[0];
                assert.equal('Lars', lars.name);
                assert.equal('Lars', lars.name);
                assert.equal(1, lars.id);
                ok();
            })
        })
    });
});