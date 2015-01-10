var path = require('path');

var config = {};

config.app = {
    name: 'mars'
};

config.app.bunyan = {
    name: config.app.name,
    streams: [
        {
            path: config.app.name + '.log'
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
        filename: config.app.name + '.sqlite'
    },
    migrations: {
        directory: path.resolve(__dirname, '../migrations')
    },
    testdata: {
        create: true
    }
};

module.exports = config;