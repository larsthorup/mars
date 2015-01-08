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
    var testContext = this;
    return repo.connecting(options).then(function (repo) {
        testContext.repo = repo;
    });
});

afterEach(function () {
    return repo.disconnecting(this.repo);
});

module.exports = {
    options: options
};