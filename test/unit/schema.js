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

beforeEach(function () {
    var context = this;
    return repo.connecting(options).then(function (repo) {
        context.repo = repo;
    });
});

afterEach(function () {
    return repo.disconnecting();
});

module.exports = {
    options: options
};