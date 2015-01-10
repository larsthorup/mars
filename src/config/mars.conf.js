module.exports = {
    server: {
        certName: '28125098_localhost',
        cors: {
            origins: ['https://localhost:1718']
        },
        bunyan: {
            name: 'mars',
            streams: [
                {
                    path: 'mars.log'
                }
            ]
        }
    }
};