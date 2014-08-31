'use strict';

exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id');
        table.string('name');
        table.string('passwordHash');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
