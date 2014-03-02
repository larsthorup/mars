var booter = require('./booter');

// ToDo: var options = require('../conf/mars.config.json')
var options = {
    server: {
        certName: '28125098_localhost'
    }
};
booter.boot(options);