var repo = require('./repo');
var server = require('./server');

function boot(options) {
    repo.connect(options.database);
    repo.sampleData().then(function () {
        server.start(options.server);
    });
}

module.exports = {
    boot: boot
};