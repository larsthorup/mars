// ToDo: use knex directly?
// ToDo: expect() instead of assert()
// ToDo: make test async by returning promise
// ToDo: raw queries

var assert = require('assert');
var Bookshelf = require('Bookshelf');

describe('Bookshelf', function () {
    var db;
    var schema;

    it('should initialize', function () {
        db = Bookshelf.initialize({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            }
        });

        schema = db.knex.schema;
    });

    it('should drop the schema', function (ok) {
        schema.dropTableIfExists('users')
        .then(function () { ok(); })
    })

    it('should create the schema', function (ok) {
        schema.createTable('users', function(table) {
            table.increments('id');
            table.string('name');
        })
        .then(function () { ok(); })
    })

    it('should insert rows', function (ok) {
        db.knex('users').insert([
            {name: 'Lars'},
            {name: 'Rob'}
        ])
        .then(function () { ok(); })
    })

    it('should select rows', function (ok) {
        db.knex('users').where({name: 'Lars'}).select()
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


/*

 var sqlite3 = require('sqlite3').verbose();

 describe('SQLite', function () {
 it('create schema', function (done) {
 var db = new sqlite3.Database('mars');
 db.serialize(function() {
 try {
 db.run('drop table user');
 } catch(ex) {
 // ignore exception when table does not exist
 }
 db.run('create table user (name text)');

 var stmt = db.prepare("insert into user values (?)");
 for (var i = 0; i < 10; i++) {
 stmt.run('User ' + i);
 }
 stmt.finalize();

 db.each("select rowid as id from user where name='User 4'", function(err, row) {
 assert.equal(5, row.id);
 });
 // assert.equal(0,4);
 });
 db.close();
 });
 });
 */

