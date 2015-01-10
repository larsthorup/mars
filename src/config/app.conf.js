var config = {};

config.app = {
    name: 'mars'
};

config.server = {
    certName: '28125098_localhost',
    cors: {
        origins: ['https://localhost:1718']
    },
    bunyan: { // ToDo: move to config.app
        name: config.app.name,
        streams: [
            {
                path: config.app.name + '.log'
            }
        ]
    }
};

// ToDo: move knexfile to config.database

module.exports = config;