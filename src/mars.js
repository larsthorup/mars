var booter = require('./booter');

// ToDo read from mars.config.json
var options = {
    server: {
        certName: '28125098_localhost'
    }
};
booter.boot(options);