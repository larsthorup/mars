var path = require('path');
var repo = require('../../src/repo');

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
    }
    // ,"debug": true
};

before(function () {
    return repo.connecting(options);
});

after(function () {
    return repo.disconnecting();
});

module.exports = {
    options: options
};