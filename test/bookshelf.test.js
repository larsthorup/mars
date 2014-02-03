// ToDo: figure out why table is not created
// ToDo: raw queries
// ToDo: use knex directly?
// ToDo: expect() instead of assert()
// ToDo: make test async by returning promise

var assert = require('assert');
var arrayIndexOf = require('../src/util');
var sqlite3 = require('sqlite3').verbose();
var Bookshelf = require('Bookshelf');

describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, arrayIndexOf([1,2,3], 5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});

describe('Bookshelf', function () {
    var db;
    var schema;

    beforeEach(function () {
        db = Bookshelf.initialize({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            }
        });

        schema = db.knex.schema;
    });

    it('should drop the schema', function (ok) {
        schema.dropTableIfExists('user')
        .then(function () { ok(); })
    })

    it('should create the schema', function (ok) {
        schema.createTable('user', function(table) {
            table.increments('id');
            table.string('name');
        })
        .then(function () { ok(); })
    })

    xit('should insert rows', function (ok) {
        db.knex('user').insert([
            {name: 'Lars'},
            {name: 'Rob'}
        ])
        .then(function () { ok(); })
    })

    xit('should select rows', function (ok) {
        db.knex('user').where({name: 'Lars'}).select()
        .then(function (lars) {
            assert.equal('Lars', lars.name);
            assert.equal(1, lars.id);
            ok();
        })
    })
});


/*
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

