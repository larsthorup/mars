/* global exports */

exports.up = function(knex, Promise) {
    return knex.schema.table('entry', function(table) {
        table.integer('version');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('entry', function(table) {
        table.dropColumn('version');
    });
};
