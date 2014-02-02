var assert = require('assert');
var arrayIndexOf = require('../src/code');
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
    it('db access', function () {
        var db = Bookshelf.initialize({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            }
        });

        var schema = db.knex.schema;
        return schema.dropTableIfExists('user')
        .then(function () {
            return schema.createTable('user', function(table) {
                table.increments('id');
                table.string('name');
            });
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

