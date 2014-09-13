'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.createTable('entry', function(table) {
        table.increments('id');
        table.string('title');
        table.string('description');
        table.boolean('isDraft');
        table.integer('authorId').references('id').inTable('user');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('entry');
};
