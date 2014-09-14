var path = require('path');

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: 'mars.sqlite'
        },
        migrations: {
            directory: path.resolve(__dirname, 'src/migrations')
        },
        testdata: {
            create: true
        }
    }

};