var repo = require('./repo');
var server = require('./server');

function boot(options) {
    repo.connecting(options.database).then(function () {
        server.start(options.server);
    });
}

module.exports = {
    boot: boot
};