var path = require('path');

var config = {};

config.app = {
    name: 'mars',
    silent: false
};

config.app.bunyan = {
    name: config.app.name,
    streams: [
        {
            path: 'app.log'
        }
    ]
};

config.server = {
    certName: '28125098_localhost',
    cors: {
        origins: ['https://localhost:1718']
    }
};

config.database = {
    // debug: true,
    client: 'sqlite3',
    connection: {
        filename: 'app.sqlite'
    },
    migrations: {
        directory: path.resolve(__dirname, '../migrations')
    },
    testdata: {
        create: false
    }
};

module.exports = config;