var path = require('path');

var options = {
    client: 'sqlite3',
    connection: {
        filename: ':memory:'
    },
    migrations: {
        directory: path.resolve(__dirname, '../../src', 'migrations')
    },
    testdata: {
        create: true
    },
    silent: true
    // ,"debug": true
};

module.exports = {
    options: options
};