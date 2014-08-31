var repo = require('../../src/repo');

before(function () {
    return repo.connecting({
        client: 'sqlite3',
        connection: {
            filename: ':memory:'
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

