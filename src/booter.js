var repo = require('./repo');
var server = require('./server');

function boot(options) {
    repo.connect();
    repo.sampleData().then(function () {
        server.start(options.server);
    });
}

module.exports = {
    boot: boot
};