var path = require('path');
var repo = require('../../src/repo');

before(function () {
    return repo.connecting({
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
    });
});

after(function () {
    return repo.disconnecting();
});

